import spacy
from spacy.matcher import Matcher

nlp = spacy.load("en_core_web_md")

matcher = Matcher(nlp.vocab)

patterns = [
    [{"LEMMA": "can"}, {"LEMMA": "not"}, {"LEMMA": "sleep"}, {"POS": "ADV", "OP": "?"}],  # "can't sleep"
    [{"LEMMA": "confused"}, {"LOWER": "about"}, {"LOWER": "job"}, {"LEMMA": "prospect"}],  # "confused about job prospects"
    [{"LEMMA": "worry"}, {"POS": "ADV", "OP": "?"}],  # Generalize for adverbs (e.g., "slightly worried", "very worried")
    [{"POS": "ADV", "OP": "?"}, {"LEMMA": "worried"}],
    [{"POS": "ADV", "OP": "?"}, {"LEMMA": "happy"}],
    [{"LEMMA": "stress"}, {"POS": "ADV", "OP": "?"}],
    [{"POS": "ADV", "OP": "?"}, {"LEMMA": "stress"}],  # Generalize for stress concerns
    [{"LOWER": "happy"}, {"LOWER": "and"}, {"LOWER": "excited"}],
    [{"LEMMA": "feel"}, {"POS": "ADV", "OP": "?"}, {"LEMMA": "hopeful"}],  # Generalize for positive feelings
    [{"POS": "ADV", "OP": "?"}, {"LEMMA": "sad"}],
    [{"LEMMA": "feel"}, {"POS": "ADV", "OP": "?"}, {"LEMMA": "sad"}],  # Generalize for sadness
    [{"LEMMA": "feel"}, {"POS": "ADV", "OP": "?"}, {"LEMMA": "happy"}],  # Generalize for happiness
    [{"LEMMA": "feel"}, {"POS": "ADV", "OP": "?"}, {"LEMMA": "anxious"}],  # Generalize for anxiety
    [{"LEMMA": "eat"}, {"LEMMA": "properly"}],  # Eating concerns
]

matcher.add("MENTAL_HEALTH_CONCERNS", patterns)

concern_categories = {
    "Health Anxiety": ["worry", "health"],
    "Eating Disorder": ["eat", "eating", "properly"],
    "Stress": ["stress", "stressed"],
    "Depression": ["sad", "hopeless", "low", "depressed"],
    "Insomnia": ["sleep", "insomnia"],
    "Career Confusion": ["confused", "job", "career"],
    "Anxiety": ["anxious", "worried", "worry"],
    "Positive Outlook": ["happy", "hopeful", "better", "excited", "happy and excited"]
}

intensity_keywords = {
    "extremely": 10,
    "very": 8,
    "quite": 7,
    "moderately": 6,
    "slightly": 4,
    "a little": 3,
    "barely": 2
}

def get_intensity_score(phrase):
    doc = nlp(phrase)
    intensity_score = 5  

    for token in doc:
        if token.pos_ == "ADV":  
            if token.text.lower() in intensity_keywords:
                intensity_score = intensity_keywords[token.text.lower()]
    
    return intensity_score

def classify_concerns(concern_phrases):
    classified_concerns = {}
    
    for phrase in concern_phrases:
        doc = nlp(phrase)
        core_lemma = [token.lemma_.lower() for token in doc if token.pos_ not in ("ADV", "DET")]
        core_lemma_text = " ".join(core_lemma)
        
        classified = False
        for category, keywords in concern_categories.items():
            for keyword in keywords:
                if keyword in core_lemma:
                    intensity = get_intensity_score(phrase)
                    if category=="Positive Outlook":
                        intensity=0
                    classified_concerns[phrase] = {"category": category, "intensity": intensity}
                    classified = True
                    break
            if classified:
                break
        
        if not classified:
            classified_concerns[phrase] = {"category": "Uncategorized", "intensity": 5}
    
    return classified_concerns

def extract_concern_phrases(text):
    doc = nlp(text)
    matches = matcher(doc)
    concern_phrases = [doc[start:end].text for match_id, start, end in matches]
    return concern_phrases

# Example usage

def net_intensity(classified_concerns):
    total_intensity = 0
    num_phrases = len(classified_concerns)

    if num_phrases == 0:
        return 0  # No phrases to classify

    for data in classified_concerns.values():
        total_intensity += data['intensity']
    
    return total_intensity / num_phrases
    
example = input("Enter the sentence: ")

concern_phrases = extract_concern_phrases(example)
classified_concerns = classify_concerns(concern_phrases)

# Print results
#print("Classified Concerns with Intensity:")
for phrase, data in classified_concerns.items():
    print(f"'{phrase}' -> Category: {data['category']}, Intensity: {data['intensity']}")

avg_intensity = net_intensity(classified_concerns)

if avg_intensity == 0:
    print("polarity = positive")
elif intensity > 2:
    print("polarity = negative")
else:
    print("polarity = neutral")
