import json, sys,re,os

def translate_text(target, text):
    # return re.sub('\n','\nAA', text)
    """Translates text into the target language.

    * target must be an ISO 639-1 language code. (e.g. it, en,...). See https://g.co/cloud/translate/v2/translate-reference#supported_languages
    * text is a newline separated string of strings

    """
    import six
    from google.cloud import translate_v2 as translate

    translate_client = translate.Client()

    if isinstance(text, six.binary_type):
        text = text.decode("utf-8")

    # Text can also be a sequence of strings, in which case this method
    # will return a sequence of results for each text.
    # bisogna usare _text (di default è html)
    result = translate_client.translate(text, target_language=target, format_='text')


    print(f"Text: {result["input"]}")
    print(f"Translation: {result["translatedText"]}")
    print(f"Detected source language: {result["detectedSourceLanguage"]}")


    return (result["translatedText"])

