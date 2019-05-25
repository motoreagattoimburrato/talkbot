/*jshint esversion: 9 */
// class for all the details of a command
const Common = require('@helpers/common'),
  fs = require('fs'),
  paths = require('@paths');

// base class for building specific TTS APIs over
class TextToSpeechService {

  // name of the service - eg. google, amazon, azure, watson
  get shortname() {
    Common.error('Please implement the shortname property');
    process.exit();
    return "unset";
  }

  // is this API enabled
  get enabled() {
    return true;
  }

  // get the char limit for this service
  get limit() {
    return 4 * 1000 * 1000;
  }

  get format() {
    return "ogg";
  }

  /**
   * [startupTests to check things this API needs to operate]
   *
   * Should exit the process if this is not configured correctly
   */
  startupTests () {
    Common.error('Please implement the startupTests function');
    process.exit();
  }

  /**
   * [buildRequest to the underlying API]
   *
   * @param {*} message
   * @param {*} settings
   *
   * @return  {[type]}  [return request object for this API]
   */
  buildRequest (message, settings) {
    Common.error('Please implement the buildRequest function');
    process.exit();
  }

  /**
   * [getAudioContent from the underlying API]
   *
   * @param {*} request
   * @param {*} callback (err, audio)
   *
   * @return  {[type]}  [return audioContent]
   */
  getAudioContent (request, callback) {
    Common.error('Please implement the getAudioContent function');
    process.exit();
  }

  /**
   * [getVoices get the voice configurations available from this service]
   *
   * @return  {[type]}  [return audioContent]
   */
  getVoices() {
    Common.error('Please implement the getVoices function');
    process.exit();
  }

  /**
   * [checkVoiceStructure confirm the voices array is formed correctly]
   *
   * @param  {*}  voices
   */
  static checkVoiceStructure(voices) {
    for ( var index in voices )
    {
      var voice = voices[index];
      //if ( !voice.voice_alias ) throw new Error('No voice_alias property:' + voice.voice);
      if ( !voice.gender ) throw new Error('No gender property');
      if ( !voice.provider ) throw new Error('No provider property');
      if ( !voice.language ) throw new Error('No language property');
      if ( !voice.translate ) throw new Error('No translate property');
      if ( !voice.voice ) throw new Error('No translate property');
      if ( !voice.code ) throw new Error('No code property');
    }
  }


  // get the first provider
  static get defaultProvider() {
    return TextToSpeechService.providers[Object.keys(TextToSpeechService.providers)[0]];
  }

  static setupProviders() {
    TextToSpeechService.providers = {};
    fs.readdirSync(paths.tts).forEach(file => {
      var api = require(paths.tts + '\\' + file);
      var obj = new api();
      if ( obj.enabled ) {
        obj.startupTests();
        TextToSpeechService.providers[obj.shortname] = obj;
      }
    });      
  }

  /**
   * [getService find the API based on the member's settings]
   *
   * @param {[memberSettings]} settings
   *
   * @return  {[TextToSpeechService]}  [return an API object to serve TTS requests]
   */
  static getService(provider) {

    provider = provider.toLowerCase();
    if (!TextToSpeechService.providers) 
      TextToSpeechService.setupProviders();

    var service = TextToSpeechService.providers[provider];
    return service;
  }

  static getVoice(voice_name, provider)
  {
    var v = null;
    var service = null;
    voice_name = voice_name.toLowerCase();

    if ( provider )
      service = TextToSpeechService.getService(provider);

    if ( service ) 
    {
      var voices = service.getVoices();
      for ( var key in voices)
      {
        v = voices[key];
        if ( v.voice == voice_name || v.voice_alias.toLowerCase() == voice_name )
          return v;
      }
    }
    else {
      for( var service in TextToSpeechService.providers )
      {
        var voices = TextToSpeechService.providers[service].getVoices();
        for ( var key in voices)
        {
          v = voices[key];
          if ( v.voice.toLowerCase() == voice_name || v.voice_alias.toLowerCase() == voice_name)
            return v;
        }
      }
    }
    return null;
  }
}

module.exports = TextToSpeechService;