import json, sys,re,os

def translate_text(target, text):
    ## return re.sub('\n','\nAA', text)
    """Translates text into the target language.

    * target must be an ISO 639-1 language code. (e.g. it, en,...). See https://g.co/cloud/translate/v2/translate-reference#supported_languages
    * text is a list of strings

    """
    import six
    from google.cloud import translate_v2 as translate

    translate_client = translate.Client()

    if isinstance(text, six.binary_type):
        text = text.decode("utf-8")

    # Text can also be a sequence of strings, in which case this method
    # will return a sequence of results for each text.
    # bisogna usare _text (di default è html)
    chunks=[]
    results=[]
    chunk_size=128
    while text:
        chunk, text = text[:chunk_size], text[chunk_size:]
        result = translate_client.translate(chunk, target_language=target, format_='text')
        results += result


    print ("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
    print (results)
    trans= [ r["translatedText"] for r in results]
    return trans
    exit(0)
    print(f"Text: {results["input"]}")
    print(f"Translation: {results["translatedText"]}")
    print(f"Detected source language: {results["detectedSourceLanguage"]}")


    return (result["translatedText"])

