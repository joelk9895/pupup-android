import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    ActionButtons,
    ContactInput,
    HomeType,
    HomeTypeOption,
    LivingSituationOption,
    LivingSituationType,
    OutdoorAccessOption,
    OutdoorAccessType,
    PetsTextInput,
    PuppyOption,
    QuestionSection,
    ReasonOption,
    ReasonType,
    ReviewItem,
    ReviewSection,
    StepPage,
    YesNoOption
} from '../components/application';
import { RootStackParamList } from '../types/navigation';
import { APIError, apiPost } from '../utils/interceptor';

type ApplicationRouteProp = RouteProp<RootStackParamList, 'Application'>;
type ApplicationNavigationProp = StackNavigationProp<RootStackParamList, 'Application'>;

type AnimalSummary = {
    id: number;
    name: string;
    gender?: string;
    description?: string;
    image_url?: string;
    booked?: boolean;
    breed?: string;
};

type YesNoAnswer = 'Yes' | 'No' | null;

type ApplicationStep = 'puppy-selection' | 'questionnaire' | 'additional-info' | 'contact-info' | 'review';

export default function Application() {
    const navigation = useNavigation<ApplicationNavigationProp>();
    const route = useRoute<ApplicationRouteProp>();

    const { litterId, puppies, litterName = '', breed = '' } = route.params ?? {
        litterId: 0,
        puppies: [],
        litterName: '',
        breed: ''
    };

    const [currentStep, setCurrentStep] = useState<ApplicationStep>('puppy-selection');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Step 1: Puppy selection
    const availablePuppies = puppies.filter(puppy => !puppy.booked);
    const [selectedPuppyId, setSelectedPuppyId] = useState<number | null>(
        availablePuppies.length > 0 ? availablePuppies[0].id : null
    );

    // Step 2: Basic questionnaire
    const [homeType, setHomeType] = useState<HomeType | null>(null);
    const [ownedBreedBefore, setOwnedBreedBefore] = useState<YesNoAnswer>(null);
    const [mainCaretaker, setMainCaretaker] = useState<YesNoAnswer>(null);

    // Step 3: Additional information
    const [outdoorAccess, setOutdoorAccess] = useState<OutdoorAccessType | null>(null);
    const [reason, setReason] = useState<ReasonType | null>(null);
    const [livingSituation, setLivingSituation] = useState<LivingSituationType[]>([]);
    const [otherPetsDescription, setOtherPetsDescription] = useState<string>('');

    // Step 4: Contact information
    const [introduction, setIntroduction] = useState<string>('');
    const [contactNumber, setContactNumber] = useState<string>('');

    const handleBeginApplication = () => {
        if (!selectedPuppyId) {
            return;
        }
        setCurrentStep('questionnaire');
    };

    const handleNextStep = () => {
        if (!homeType || !ownedBreedBefore || !mainCaretaker) {
            return;
        }
        setCurrentStep('additional-info');
    };

    const handleNextToContact = () => {
        if (!outdoorAccess || !reason || livingSituation.length === 0) {
            return;
        }
        setCurrentStep('contact-info');
    };

    const handleNextToReview = () => {
        if (!introduction.trim() || !contactNumber.trim()) {
            return;
        }
        setCurrentStep('review');
    };

    const handleSubmitApplication = async () => {
        try {
            // Get user ID from AsyncStorage
            const userDataString = await AsyncStorage.getItem('user_data');
            if (!userDataString) {
                Alert.alert('Error', 'User authentication required. Please log in again.');
                return;
            }
            const userData = JSON.parse(userDataString);

            setIsSubmitting(true);

            const userInfo: Record<string, any> = {
                "What kind of home do you live in?": homeType || "",
                [`Have you owned a ${breed || "puppy"} before?`]: ownedBreedBefore || "",
                "Will you be the main caretaker?": mainCaretaker || "",
                "What's your outdoor access like?": outdoorAccess || "",
                "Why are you bringing this dog home?": reason || "",
                "Do you have other pets in your household?": otherPetsDescription,
                "Introduce yourself?": introduction,
                "Enter your phone number": contactNumber
            };

            // Build payload
            const payload: Record<string, any> = {
                user_id: parseInt(userData.id, 10),
                litter_id: litterId,
                user_info: userInfo,
                approved: false
            };

            if (selectedPuppyId) {
                payload.puppy_id = selectedPuppyId;
            }

            await apiPost('apply-puppy/', payload);

            navigation.replace('ApplicationSuccess', {
                puppy: puppies.find(p => p.id === selectedPuppyId)!
            });

        } catch (error) {
            console.error('Failed to submit application:', error);

            let errorMessage = 'Failed to submit application. Please try again.';
            if (error instanceof APIError) {
                errorMessage = error.message;
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        navigation.goBack();
    };

    const handleBack = () => {
        if (currentStep === 'questionnaire') {
            setCurrentStep('puppy-selection');
        } else if (currentStep === 'additional-info') {
            setCurrentStep('questionnaire');
        } else if (currentStep === 'contact-info') {
            setCurrentStep('additional-info');
        } else if (currentStep === 'review') {
            setCurrentStep('contact-info');
        }
    };

    const handleLivingSituationToggle = (option: LivingSituationType) => {
        if (option === 'No') {
            // If "No" is selected, clear all other selections
            setLivingSituation(['No']);
        } else {
            // If any other option is selected, remove "No" if it exists
            const newSelection = livingSituation.filter(item => item !== 'No');

            if (livingSituation.includes(option)) {
                // Remove if already selected
                setLivingSituation(newSelection.filter(item => item !== option));
            } else {
                // Add to selection
                setLivingSituation([...newSelection, option]);
            }
        }
    };

    // Validation checks
    const isPuppySelectionValid = selectedPuppyId !== null;
    const isQuestionnaireValid = homeType !== null && ownedBreedBefore !== null && mainCaretaker !== null;
    const isAdditionalInfoValid = outdoorAccess !== null && reason !== null && livingSituation.length > 0;
    const isContactInfoValid = introduction.trim().length > 0 && contactNumber.trim().length > 0;

    // Get selected puppy for display
    const selectedPuppy = puppies.find((p: AnimalSummary) => p.id === selectedPuppyId);
    const selectedPuppyName = selectedPuppy?.name || 'the puppy';

    if (availablePuppies.length === 0) {
        return (
            <StepPage
                title="No Available Puppies"
                currentStep={0}
                totalSteps={4}
                onClose={handleClose}
            >
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No available puppies in this litter at the moment. Please check back later.
                    </Text>
                </View>
                <ActionButtons
                    primaryLabel="Go Back"
                    onPrimaryPress={handleClose}
                />
            </StepPage>
        );
    }

    if (currentStep === 'puppy-selection') {
        return (
            <StepPage
                title="Select your Puppy"
                currentStep={0}
                totalSteps={4}
                onClose={handleClose}
            >
                <FlatList
                    style={{ flex: 1, marginVertical: 16 }}
                    data={puppies}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <PuppyOption
                            {...item}
                            selected={item.id === selectedPuppyId}
                            onSelect={() => setSelectedPuppyId(item.id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
                <ActionButtons
                    primaryLabel="Begin Application"
                    onPrimaryPress={handleBeginApplication}
                    disabled={!isPuppySelectionValid}
                />
            </StepPage>
        );
    }

    if (currentStep === 'questionnaire') {
        return (
            <StepPage
                title="Puppy Application"
                currentStep={1}
                totalSteps={4}
                onClose={handleClose}
            >
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <QuestionSection question="What kind of home do you live in?">
                        <View style={styles.homeTypeContainer}>
                            <HomeTypeOption
                                type="Condo"
                                selected={homeType === 'Condo'}
                                onSelect={() => setHomeType('Condo')}
                            />
                            <HomeTypeOption
                                type="HDB"
                                selected={homeType === 'HDB'}
                                onSelect={() => setHomeType('HDB')}
                            />
                            <HomeTypeOption
                                type="Landed"
                                selected={homeType === 'Landed'}
                                onSelect={() => setHomeType('Landed')}
                            />
                        </View>
                    </QuestionSection>

                    <QuestionSection question={`Have you owned a ${breed} before?`}>
                        <View style={styles.yesNoContainer}>
                            <YesNoOption
                                value="yes"
                                label="Yes"
                                selected={ownedBreedBefore === 'Yes'}
                                onSelect={() => setOwnedBreedBefore('Yes')}
                            />
                            <YesNoOption
                                value="no"
                                label="No"
                                selected={ownedBreedBefore === 'No'}
                                onSelect={() => setOwnedBreedBefore('No')}
                            />
                        </View>
                    </QuestionSection>

                    <QuestionSection question="Will you be the main caretaker?">
                        <View style={styles.yesNoContainer}>
                            <YesNoOption
                                value="yes"
                                label="Yes"
                                selected={mainCaretaker === 'Yes'}
                                onSelect={() => setMainCaretaker('Yes')}
                            />
                            <YesNoOption
                                value="no"
                                label="No"
                                selected={mainCaretaker === 'No'}
                                onSelect={() => setMainCaretaker('No')}
                            />
                        </View>
                    </QuestionSection>
                </ScrollView>

                <ActionButtons
                    primaryLabel="Next Step"
                    onPrimaryPress={handleNextStep}
                    onBack={handleBack}
                    disabled={!isQuestionnaireValid}
                />
            </StepPage>
        );
    }

    if (currentStep === 'additional-info') {
        return (
            <StepPage
                title="Puppy Application"
                currentStep={2}
                totalSteps={4}
                onClose={handleClose}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scrollContentContainer}
                    >
                        <QuestionSection question="What's your outdoor access like?">
                            <View style={styles.outdoorAccessContainer}>
                                <OutdoorAccessOption
                                    type="Local Park"
                                    selected={outdoorAccess === 'Local Park'}
                                    onSelect={() => setOutdoorAccess('Local Park')}
                                />
                                <OutdoorAccessOption
                                    type="Fenced Yard"
                                    selected={outdoorAccess === 'Fenced Yard'}
                                    onSelect={() => setOutdoorAccess('Fenced Yard')}
                                />
                            </View>
                        </QuestionSection>

                        <QuestionSection question="Why are you bringing this dog home?">
                            <View style={styles.reasonContainer}>
                                <ReasonOption
                                    type="Companionship"
                                    selected={reason === 'Companionship'}
                                    onSelect={() => setReason('Companionship')}
                                />
                                <ReasonOption
                                    type="Show"
                                    selected={reason === 'Show'}
                                    onSelect={() => setReason('Show')}
                                />
                                <ReasonOption
                                    type="Agility"
                                    selected={reason === 'Agility'}
                                    onSelect={() => setReason('Agility')}
                                />
                            </View>
                        </QuestionSection>

                        <QuestionSection question="Is there anyone else you live with">
                            <View style={styles.livingSituationContainer}>
                                {(['No', 'My Partner', 'Other Adults', 'Young Kids', 'Kids over 5'] as LivingSituationType[]).map((option) => (
                                    <LivingSituationOption
                                        key={option}
                                        type={option}
                                        selected={livingSituation.includes(option)}
                                        onSelect={() => handleLivingSituationToggle(option)}
                                    />
                                ))}
                            </View>
                        </QuestionSection>

                        <QuestionSection question="Do you have other pets in your household?">
                            <PetsTextInput
                                value={otherPetsDescription}
                                onChangeText={setOtherPetsDescription}
                                placeholder="Describe your pets"
                            />
                        </QuestionSection>
                    </ScrollView>
                </KeyboardAvoidingView>

                <ActionButtons
                    primaryLabel="Next Step"
                    onPrimaryPress={handleNextToContact}
                    onBack={handleBack}
                    disabled={!isAdditionalInfoValid}
                />
            </StepPage>
        );
    }

    if (currentStep === 'contact-info') {
        return (
            <StepPage
                title="Puppy Application"
                currentStep={3}
                totalSteps={4}
                onClose={handleClose}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContentContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.contactFormContainer}>
                            <PetsTextInput
                                value={introduction}
                                onChangeText={setIntroduction}
                                placeholder={`Introduce yourself to ${litterName} or ask a question about ${selectedPuppyName}. Provide any relevant information including your experience with dogs.`}
                            />

                            <QuestionSection question="Contact Number">
                                <ContactInput
                                    value={contactNumber}
                                    onChangeText={setContactNumber}
                                    placeholder="9000 0000"
                                />
                            </QuestionSection>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <ActionButtons
                    primaryLabel="Review Application"
                    onPrimaryPress={handleNextToReview}
                    onBack={handleBack}
                    disabled={!isContactInfoValid}
                />
            </StepPage>
        );
    }

    // Review Step
    if (currentStep === 'review') {
        return (
            <StepPage
                title="Review & Submit"
                currentStep={4}
                totalSteps={4}
                onClose={handleClose}
            >
                <ScrollView style={{ flex: 1, marginTop: 20 }} showsVerticalScrollIndicator={false}>

                    <ReviewSection title="Basic Information">
                        <ReviewItem
                            question="What kind of home do you live in?"
                            answer={homeType || ''}
                        />
                        <ReviewItem
                            question={`Have you owned a ${breed} before?`}
                            answer={ownedBreedBefore || ''}
                        />
                        <ReviewItem
                            question="Will you be the main caretaker?"
                            answer={mainCaretaker || ''}
                        />
                    </ReviewSection>

                    <ReviewSection title="Additional Details">
                        <ReviewItem
                            question="What's your outdoor access like?"
                            answer={outdoorAccess || ''}
                        />
                        <ReviewItem
                            question="Why are you bringing this dog home?"
                            answer={reason || ''}
                        />
                        <ReviewItem
                            question="Is there anyone else you live with?"
                            answer={livingSituation}
                        />
                        {otherPetsDescription.trim() && (
                            <ReviewItem
                                question="Do you have other pets in your household?"
                                answer={otherPetsDescription}
                            />
                        )}
                    </ReviewSection>

                    <ReviewSection title="Contact Information">
                        <ReviewItem
                            question="Introduction"
                            answer={introduction}
                        />
                        <ReviewItem
                            question="Contact Number"
                            answer={contactNumber}
                        />
                    </ReviewSection>
                </ScrollView>

                <ActionButtons
                    primaryLabel={isSubmitting ? "Submitting..." : "Submit Application"}
                    onPrimaryPress={handleSubmitApplication}
                    onBack={handleBack}
                    disabled={isSubmitting}
                />
            </StepPage>
        );
    }

    // This should never be reached, but keeping as fallback
    return null;
}

const styles = StyleSheet.create({
    homeTypeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    yesNoContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    outdoorAccessContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    reasonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    livingSituationContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    scrollContentContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    contactFormContainer: {
        flex: 1,
        gap: 16,
    },
});
