import { getCurrentUserId } from '@/app/utils/userUtils';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ParentsDetailCard from '../components/breeds/parentsDetailCard';
import PuppiesCard from '../components/breeds/puppiesCard';
import Timeline from '../components/breeds/timeLine';
import PuppyCountRow from '../components/common/pupCount';
import FeaturedBreederHome from '../components/home/featuredBreederHome';
import CalendarIcon from '../icons/calendarIcon';
import CloseIcon from '../icons/closeIcon';
import LocationIcon from '../icons/locationIcon';
import WalletIcon from '../icons/walletIcon';
import { RootStackParamList } from '../types/navigation';
import { apiGet } from '../utils/interceptor';

type LitterRouteProp = RouteProp<RootStackParamList, 'Litter'>;
type LitterNavigationProp = StackNavigationProp<RootStackParamList, 'Litter'>;

type AnimalSummary = {
  id: number;
  name: string;
  gender?: string;
  description?: string;
  image_url?: string;
  booked?: boolean;
  breed?: string;
};

type ParentSummary = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  breed?: number;
  gender?: string;
  medical_info?: any[];
};

type BreederDetails = {
  id: number;
  name: string;
  email?: string;
  description?: string;
  profile_img?: string;
  location?: string;
  website_url?: string;
  breeding_dogs?: ParentSummary[];
  background_img: string;
};

type TimelineItem = {
  title: string;
  description: string;
  date: string;
  image_urls?: string[];
};

type LitterResponseItem = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  breeder: number;
  father: number;
  mother: number;
  price?: number;
  deposit?: number;
  expected_dogs?: number;
  ready_date?: string;
  timeline?: TimelineItem[];
  status?: string;
  thumbnail_url?: string;
  min_transport_charge?: number;
  max_transport_charge?: number;
  breeder_details: BreederDetails;
  father_details?: ParentSummary;
  mother_details?: ParentSummary;
  puppies?: AnimalSummary[];
};

type ApplicationResponse = {
  id: number;
  approved: boolean;
  litter: {
    id: number;
    name: string;
  };
  user: any;
  puppy: any;
  user_info: object;
  status: string;
};

function InfoRow({ icon, label, value, onPress }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const RowContent = (
    <>
      <View style={styles.infoLeft}>
        {icon}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.infoRow} onPress={onPress} activeOpacity={0.7}>
        {RowContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.infoRow}>{RowContent}</View>;
}

function PriceBreakdownCard({
  basePrice,
  deposit,
  minTransport,
  maxTransport,
  onClose
}: {
  basePrice: number;
  deposit: number;
  minTransport: number;
  maxTransport: number;
  onClose: () => void;
}) {
  return (
    <View style={styles.breakdownCard}>
      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownTitle}>Price Breakdown</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Puppy Price</Text>
        <Text style={styles.breakdownValue}>${basePrice.toLocaleString()}</Text>
      </View>

      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Deposit</Text>
        <Text style={styles.breakdownValue}>${deposit.toLocaleString()}</Text>
      </View>

      <View style={styles.breakdownRow}>
        <Text style={styles.breakdownLabel}>Transport</Text>
        <Text style={styles.breakdownValue}>
          {minTransport === maxTransport
            ? `$${minTransport.toLocaleString()}`
            : `$${minTransport.toLocaleString()} - $${maxTransport.toLocaleString()}`
          }
        </Text>
      </View>
      <View style={[styles.breakdownRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          {minTransport === maxTransport
            ? `$${(basePrice + minTransport).toLocaleString()}`
            : `$${(basePrice + minTransport).toLocaleString()} - $${(basePrice + maxTransport).toLocaleString()}`
          }
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
        Includes vaccinations, deworming, a vet check, access to Good Dog's Puppy Training Program (a $235 value), 10% lifetime discount on Louie's insurance, and more.
      </Text>
    </View>
  );
}

export default function LitterScreen() {
  const route = useRoute<LitterRouteProp>();
  const navigation = useNavigation<LitterNavigationProp>();
  const litterId = route.params?.litterId;
  const selectedPuppyId = route.params?.selectedPuppyId;
  const scrollViewRef = useRef<ScrollView>(null);
  const puppyRefs = useRef<{ [id: number]: React.RefObject<View | null> }>({});
  const [coordinate, setCoordinate] = useState<{ [key: number]: number }>({});
  const [litter, setLitter] = useState<LitterResponseItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedPuppies, setBookedPuppies] = useState<number>(0);
  const [totalPuppies, setTotalPuppies] = useState<number>(0);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [breedName, setBreedName] = useState<string>('');
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [checkingApplication, setCheckingApplication] = useState<boolean>(true);
  const [userApplicationStatus, setUserApplicationStatus] = useState<string | null>(null);

  const checkExistingApplication = async (userId: number) => {
    try {
      setCheckingApplication(true);
      const applications = await apiGet<ApplicationResponse[]>('apply-puppy/user', {
        user_id: userId,
      });

      console.log('User applications:', applications);
      const existingApplication = applications.find(
        (app) => app.litter.id === litterId
      );

      if (existingApplication) {
        setHasApplied(true);
        setUserApplicationStatus(existingApplication.status);
      } else {
        setHasApplied(false);
        setUserApplicationStatus(null);
      }
    } catch (error) {
      console.error('Error checking applications:', error);
      setHasApplied(false);
      setUserApplicationStatus(null);
    } finally {
      setCheckingApplication(false);
    }
  };

  const openPuppy = (puppy: AnimalSummary) => {
    if (coordinate[puppy.id] !== undefined) {
      scrollViewRef.current?.scrollTo({ y: coordinate[puppy.id] - 100, animated: true });
    }
  };

  useEffect(() => {
    if (!litterId) {
      setError('Missing litter id');
      setLoading(false);
      return;
    }

    const fetchLitterAndCheckApplication = async () => {
      setLoading(true);
      try {
        const userId = await getCurrentUserId();

        const resp = await apiGet<any>(`litters/${litterId}`);
        const item: LitterResponseItem | undefined =
          Array.isArray(resp) ? resp[0] : resp;
        if (!item) throw new Error('Litter not found');

        if (item.father_details?.breed) {
          try {
            const breedData = await apiGet<any>(`breed/${item.father_details.breed}`);
            setBreedName(breedData.name || 'Unknown Breed');
          } catch (breedErr) {
            console.warn('Failed to fetch breed data:', breedErr);
            setBreedName('Unknown Breed');
          }
        }

        setLitter(item);

        if (userId) {
          await checkExistingApplication(userId);
        } else {
          setCheckingApplication(false);
        }

      } catch (err: any) {
        console.error('Failed to fetch litter:', err);
        setError(err?.message ?? 'Failed to load litter');
        setCheckingApplication(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLitterAndCheckApplication();
  }, [litterId]);

  const puppies = litter?.puppies || [];
  const slots_filled = litter?.status === 'Available' ? 0 : puppies.filter(pup => pup.booked).length;
  const expected_dogs = litter?.expected_dogs || 0;

  // Create refs for each puppy
  puppies.forEach(pup => {
    if (!puppyRefs.current[pup.id]) {
      puppyRefs.current[pup.id] = React.createRef<View>();
    }
  });

  useEffect(() => {
    if (puppies.length > 0) {
      const booked = puppies.filter(pup => pup.booked).length;
      const total = puppies.length;
      setBookedPuppies(booked);
      setTotalPuppies(total);
    } else {
      setBookedPuppies(slots_filled);
      setTotalPuppies(expected_dogs);
    }
  }, [puppies, slots_filled, expected_dogs]);

  // Auto scroll to selected puppy when coordinates are available
  useEffect(() => {
    if (!loading && selectedPuppyId && coordinate[selectedPuppyId] !== undefined) {
      const targetPuppy = puppies.find(p => p.id === selectedPuppyId);
      if (targetPuppy) {
        setTimeout(() => {
          openPuppy(targetPuppy);
        }, 500);
      }
    }
  }, [loading, selectedPuppyId, coordinate]);

  const handleApply = async () => {
    const userId = await getCurrentUserId();
    if (!userId) {
      alert('Please log in to apply');
      return;
    }

    if (hasApplied) {
      alert(`You have already applied to this litter. Status: ${userApplicationStatus}`);
      return;
    }

    navigation?.navigate('Application', {
      litterId: litterId!,
      puppies: puppies,
      litterName: litter?.name || '',
      breed: breedName
    });
  };

  const getButtonText = () => {
    if (checkingApplication) return 'Checking...';
    if (hasApplied) {
      switch (userApplicationStatus) {
        case 'APPLIED':
          return 'Application Pending';
        case 'APPROVED':
          return 'Application Approved';
        case 'REJECTED':
          return 'Application Rejected';
        default:
          return 'Already Applied';
      }
    }
    return 'Apply';
  };

  const getButtonStyle = () => {
    if (hasApplied || checkingApplication) {
      return [styles.applyButton, styles.applyButtonDisabled];
    }
    return styles.applyButton;
  };

  const getButtonTextStyle = () => {
    if (hasApplied || checkingApplication) {
      return [styles.applyButtonText, styles.applyButtonTextDisabled];
    }
    return styles.applyButtonText;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#152C70" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!litter) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No litter data available.</Text>
      </SafeAreaView>
    );
  }

  const basePrice = litter.price ?? 0;
  const deposit = litter.deposit ?? 0;
  const minTransport = litter.min_transport_charge ?? 0;
  const maxTransport = litter.max_transport_charge ?? 0;

  const minTotal = basePrice + minTransport;
  const maxTotal = basePrice + maxTransport;

  const priceGuideText = minTransport === maxTransport
    ? `$${minTotal.toLocaleString()}`
    : `$${minTotal.toLocaleString()} - $${maxTotal.toLocaleString()}`;



  return (
    <View style={styles.container}>
      {/* Close Button - Positioned absolutely over content */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <CloseIcon />
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {litter.thumbnail_url || litter.image_url ? (
          <Image source={{ uri: litter.thumbnail_url ?? litter.image_url }} style={styles.heroImage} />
        ) : null}

        <View style={styles.header}>
          <Text style={styles.breed}>{breedName}</Text>
          <Text style={styles.title}>{litter.name}</Text>
          <PuppyCountRow
            totalPuppies={totalPuppies}
            bookedPuppies={bookedPuppies}
            status={litter.status === 'Available' ? 'AVAILABLE' : 'EXPECTED'}
            size="medium"
            showText={false}
          />
          <Text style={styles.litterInfo}>
            {(totalPuppies > 0 && bookedPuppies === totalPuppies) ? `${bookedPuppies}/${totalPuppies} Puppies Reserved` : 'Accepting Expression of Interest'}
          </Text>
        </View>

        <View style={styles.litterInfoSection}>
          <InfoRow
            icon={<CalendarIcon />}
            label="Ready to go home"
            value={
              litter.ready_date
                ? new Date(litter.ready_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
                : 'TBA'
            }
          />
          <InfoRow
            icon={<LocationIcon />}
            label="Location"
            value={litter.breeder_details?.location ?? 'Not specified'}
          />
          <View style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', gap: 8 }}>
            <InfoRow
              icon={<WalletIcon />}
              label="Price Guide"
              value={priceGuideText}
              onPress={() => setShowPriceBreakdown((prev) => !prev)}
            />
            <Text onPress={() => setShowPriceBreakdown((prev) => !prev)} style={{ fontSize: 14, color: '#666', textDecorationLine: 'underline', alignSelf: 'flex-end', fontFamily: 'Figtree_400Regular' }}> Show Breakdown</Text>
          </View>
        </View>

        {showPriceBreakdown && (
          <View style={styles.breakdownContainer}>
            <PriceBreakdownCard
              basePrice={basePrice}
              deposit={deposit}
              minTransport={minTransport}
              maxTransport={maxTransport}
              onClose={() => setShowPriceBreakdown(false)}
            />
          </View>
        )}
        <View style={styles.litterDescriptionSection}>
          <Text style={styles.description}>
            {litter.description
              ? litter.description
              : null}
          </Text>
        </View>
        <FeaturedBreederHome breeder={litter.breeder_details} />

        <View>
          <View>
            {puppies.length > 0 ? (
              <>
                <Text style={[styles.title, { marginBottom: 24, marginHorizontal: 20 }]}>Puppies</Text>
                <View style={styles.puppiesContainer}>
                  {puppies.map((pup) => (
                    <TouchableOpacity
                      key={pup.id}
                      ref={puppyRefs.current[pup.id]}
                      onPress={() => openPuppy(pup)}
                      onLayout={() => {
                        // Measure this puppy card relative to the scrollView
                        puppyRefs.current[pup.id].current?.measureLayout(
                          scrollViewRef.current as unknown as number, // measureLayout expects a node handle (number)
                          (x: number, y: number, w: number, h: number) => {
                            setCoordinate((prev: { [key: number]: number }) => ({
                              ...prev,
                              [pup.id]: y,
                            }));
                            console.log(`Puppy ${pup.id} position:`, y);
                          },
                          () => {
                            console.warn('Error measuring puppy layout');
                          }
                        );
                      }}
                    >
                      <PuppiesCard
                        puppy={pup}
                        onPress={() => {
                          console.log('Puppy pressed:', pup.name);
                        }}
                        showBookedStatus={true}
                        imagePosition="right"
                        size="large"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        </View>

        {(litter.father_details || litter.mother_details) ? (
          <View style={styles.litterInfoSection}>
            <Text style={styles.title}>Parents</Text>

            {litter.father_details ? (
              <ParentsDetailCard
                parent={litter.father_details}
                type="FATHER"
              />
            ) : null}

            {litter.mother_details ? (
              <ParentsDetailCard
                parent={litter.mother_details}
                type="MOTHER"
              />
            ) : null}
          </View>
        ) : null}

        <Timeline timeline={litter.timeline ?? []} />
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={getButtonStyle()}
          onPress={handleApply}
          activeOpacity={hasApplied || checkingApplication ? 1 : 0.8}
          disabled={hasApplied || checkingApplication}
        >
          <Text style={getButtonTextStyle()}>{getButtonText()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  closeButton: {
    position: 'absolute',
    top: 2n 0,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  scroll: { paddingBottom: 100 },
  center: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  heroImage: { width: '100%', height: 360, marginBottom: 16 },
  header: { padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center' },
  title: { fontSize: 34, fontFamily: 'Recoleta', color: '#000', marginBottom: 6, textAlign: 'center' },
  description: { fontSize: 16, fontFamily: 'Roboto', color: '#020617', marginBottom: 6, lineHeight: 28 },
  errorText: { color: '#666', fontSize: 16 },
  subItem: { fontSize: 14, color: '#222', marginBottom: 6 },
  muted: { fontSize: 12, color: '#777' },
  litterInfo: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  litterInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Figtree_400Regular',
    color: '#000',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#666',
    textAlign: 'right',
    maxWidth: '40%',
  },
  accordionContainer: {
    paddingHorizontal: 20,
  },
  breakdownContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontFamily: 'Figtree_600SemiBold',
    color: '#000',
  },

  closeButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#495057',
  },
  breakdownValue: {
    fontSize: 14,
    fontFamily: 'Figtree_600SemiBold',
    color: '#212529',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Figtree_600SemiBold',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Figtree_700Bold',
    color: '#000',
  },
  litterDescriptionSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderTopWidth: 0.25,
    borderTopColor: '#989898',
    paddingTop: 16,
  },
  breed: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.34,
    fontFamily: 'Figtree_700Bold',
    color: '#95979E',
    marginBottom: 12,
  },
  puppiesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
  },
  applyButton: {
    backgroundColor: '#000',
    borderRadius: 500,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#152C70',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  applyButtonDisabled: {
    backgroundColor: '#E9ECEF',
    shadowOpacity: 0,
    elevation: 0,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  applyButtonTextDisabled: {
    color: '#6C757D',
  },
  highlightedPuppy: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: -8,
    borderWidth: 2,
    borderColor: '#3171F7',
  },
});