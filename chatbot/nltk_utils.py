import nltk
from nltk.stem.snowball import SnowballStemmer
# nltk.download('punkt')

def tokenize(sentence):
    return nltk.word_tokenize(sentence)

def stemm(word):
    stemmer = SnowballStemmer(language='english', ignore_stopwords=True)
    return stemmer.stem(word.lower())

def bag_of_words(tokenized_sentence, words):
    pass


sentence = "How long does shipping take?"
tokenized_sentence = tokenize(sentence)
print([stemm(word) for word in tokenized_sentence])


