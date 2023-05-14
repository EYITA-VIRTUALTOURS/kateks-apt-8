(function(){
    var script = {
 "paddingTop": 0,
 "start": "this.init()",
 "children": [
  "this.MainViewer"
 ],
 "id": "rootPlayer",
 "shadow": false,
 "scrollBarMargin": 2,
 "vrPolyfillScale": 1,
 "borderRadius": 0,
 "scrollBarWidth": 10,
 "width": "100%",
 "propagateClick": false,
 "minHeight": 20,
 "layout": "absolute",
 "horizontalAlign": "left",
 "paddingRight": 0,
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "backgroundPreloadEnabled": true,
 "overflow": "visible",
 "defaultVRPointer": "laser",
 "minWidth": 20,
 "scrollBarVisible": "rollOver",
 "height": "100%",
 "gap": 10,
 "scrollBarColor": "#000000",
 "scripts": {
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "getKey": function(key){  return window[key]; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "existsKey": function(key){  return key in window; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "unregisterKey": function(key){  delete window[key]; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "registerKey": function(key, value){  window[key] = value; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } }
 },
 "definitions": [{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_02C3F4F3_1966_CFC9_41B2_D88054EA8C5E",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -177.86,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CD6F509_1656_2E57_41A8_1D8509221461_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_02F9D4E4_1966_CFCF_4190_85210C502E97",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 117.32,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Common Bathroom_001",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": 116.16,
   "yaw": -87.17,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD97888_1652_2655_419E_D77E00E375D0"
  },
  {
   "backwardYaw": 48.86,
   "yaw": 100.24,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C"
  }
 ],
 "id": "panorama_1C2B843D_1652_2EAE_418A_146EAF582440",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_t.jpg",
 "overlays": [
  "this.overlay_0D82BCC7_1929_7FC8_41AD_AEB5CD0D2BA9",
  "this.overlay_0C3CD838_1929_C647_41B4_D694CE1111FE",
  "this.overlay_0C0F5F49_1929_7AD9_4195_9ADA1AD9E477",
  "this.overlay_0DB2AFA3_192B_7A49_41AA_7C23B5A8D626"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "items": [
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "media": "this.panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "media": "this.panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "media": "this.panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "media": "this.panorama_1CD97888_1652_2655_419E_D77E00E375D0",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CD97888_1652_2655_419E_D77E00E375D0_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "media": "this.panorama_1CD8D112_1652_667A_4197_E2457EFAFABF",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "media": "this.panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "media": "this.panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "media": "this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "media": "this.panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "media": "this.panorama_1CD6F509_1656_2E57_41A8_1D8509221461",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CD6F509_1656_2E57_41A8_1D8509221461_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "media": "this.panorama_1CD4A113_1652_667A_41B3_C01836F650B0",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CD4A113_1652_667A_41B3_C01836F650B0_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "media": "this.panorama_1C2B843D_1652_2EAE_418A_146EAF582440",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1C2B843D_1652_2EAE_418A_146EAF582440_camera",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 0)",
   "media": "this.panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_camera",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_02FE84D4_1966_CFCF_4189_A11F7B298E2D",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -33.04,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_3802B408_1966_CE47_41B8_BF5E84B1D2AC",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -59.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_397082F8_1966_CBC7_41B6_4BF00C851CD7",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -82.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_0529D545_1966_CEC9_4185_F68B28E7338C",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 92.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_383203F7_1966_C9C9_41B7_EB72D416D15B",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 178.62,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Maid room_002",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": 97.98,
   "yaw": 146.96,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524"
  },
  {
   "backwardYaw": 97.98,
   "yaw": -149.35,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524"
  }
 ],
 "id": "panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_t.jpg",
 "overlays": [
  "this.overlay_0B061BB9_191A_B9B9_41A2_090866F82113",
  "this.overlay_0B1DF81E_191B_4678_41B3_733B9177AC1E",
  "this.overlay_0A83A46A_191B_4EDB_41B0_AC66641513F1"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "partial": false,
 "label": "Master Bedroom_003",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": 2.14,
   "yaw": -15.2,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0"
  }
 ],
 "id": "panorama_1CD6F509_1656_2E57_41A8_1D8509221461",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_t.jpg",
 "overlays": [
  "this.overlay_0AC2DD46_192B_7ECB_41AE_9D05C9AF4508",
  "this.overlay_0DC16038_192B_46B8_419F_FBF9F037EC56"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_02F7F4B5_1966_CE49_41A9_D4E2370480F8",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -131.14,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_0524E537_1966_CE49_41AA_581AF53B58D9",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -174.72,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_02CED50B_1966_CE59_41B6_09B46068D678",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 36.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Kids room_001",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": -63.71,
   "yaw": -143.57,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD97888_1652_2655_419E_D77E00E375D0"
  }
 ],
 "id": "panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_t.jpg",
 "overlays": [
  "this.overlay_082EE8D7_191B_47C9_41A0_10783280B928",
  "this.overlay_087287D1_1919_49C9_41B4_915BF5EB820F"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_38649427_1966_CE49_419E_CFB8FD421F91",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -63.84,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_3821B3E3_1966_C9C9_41B2_421CCEC2F767",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -147.72,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_3952D327_1966_CA48_41A3_3BB3EFC2CA91",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -27.26,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_394DD318_1966_CA47_41B7_D02EFCD45EE6",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 34.79,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Master Bedroom_002",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": -62.68,
   "yaw": 6.78,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0"
  }
 ],
 "id": "panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_t.jpg",
 "overlays": [
  "this.overlay_0AFF3900_1929_4647_41B8_D6CF16B98EE2",
  "this.overlay_0F0A7B0F_192A_BA59_41B6_C83E54D58A1C"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_39CF13BC_1966_C9BF_4183_3E3680B6E91E",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -161.26,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_02C8951A_1966_CE7B_41B2_291C594E6D26",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -51.63,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Living_003",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": -1.38,
   "yaw": 0.88,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524"
  },
  {
   "backwardYaw": 120.84,
   "yaw": -150.23,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B"
  },
  {
   "backwardYaw": 120.84,
   "yaw": 155.25,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B"
  }
 ],
 "id": "panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_t.jpg",
 "overlays": [
  "this.overlay_179E882F_18E9_4659_41A4_DDC226A6E91B",
  "this.overlay_17F510AB_18E6_C659_41B0_139D9CDB5C46",
  "this.overlay_17F613B5_18E7_4A48_4171_8CB1FC8368E2",
  "this.overlay_17D24CE7_18F9_BFC9_41B7_46762F55D56B",
  "this.overlay_08F9830E_18FA_CA5B_41A2_73693CC0D036"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CD97888_1652_2655_419E_D77E00E375D0_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_39FD33AC_1966_CA5F_41B2_87B88B2B3775",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -168.44,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_39BA3360_1966_CAC8_41B8_36D6E57ADE05",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 14.19,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_398A4376_1966_CAC8_41B5_56FA11C86FE5",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 40.95,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Living Corridor",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": -143.57,
   "yaw": -63.71,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0"
  },
  {
   "backwardYaw": 128.37,
   "yaw": -165.81,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0"
  },
  {
   "backwardYaw": 136.92,
   "yaw": 11.56,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A"
  },
  {
   "backwardYaw": 5.28,
   "yaw": 152.74,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD8D112_1652_667A_4197_E2457EFAFABF"
  },
  {
   "backwardYaw": -87.17,
   "yaw": 116.16,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1C2B843D_1652_2EAE_418A_146EAF582440"
  }
 ],
 "id": "panorama_1CD97888_1652_2655_419E_D77E00E375D0",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_t.jpg",
 "overlays": [
  "this.overlay_17864508_18EB_4E47_41B8_7D5C9F6EE882",
  "this.overlay_08CE8ED3_18EA_BBC8_418E_5148AD89FAD1",
  "this.overlay_084331DE_18EA_C9FB_419A_429DD68E13C6",
  "this.overlay_098F8D2F_18E9_BE59_41AC_43FE3C8F0777",
  "this.overlay_09A92CE2_18EB_BFCB_41B8_42C1F0861C86",
  "this.overlay_091F83CF_18EB_C9D8_4195_FD7DB7DA3B79",
  "this.overlay_0AC638CD_18EB_C7D8_41A6_5A6AA0C7D74A",
  "this.overlay_0A6CD4FE_191A_CFBB_4184_1C8B45B8DF36",
  "this.overlay_051EB997_192F_4649_41B0_4E7DCC59B2F9",
  "this.overlay_05A7C94C_192F_C6DF_41A2_3EE063672AC8"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_39A75338_1966_CAB8_4176_AB72BB9A570A",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -173.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Guest room_001",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": 152.74,
   "yaw": 5.28,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD97888_1652_2655_419E_D77E00E375D0"
  }
 ],
 "id": "panorama_1CD8D112_1652_667A_4197_E2457EFAFABF",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_t.jpg",
 "overlays": [
  "this.overlay_08240E59_18E9_DAF8_41B3_3F0B6692C3ED",
  "this.overlay_099CFBA6_18E9_5A48_419B_9144BE867098"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "partial": false,
 "label": "Living_002",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": -150.23,
   "yaw": 120.84,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E"
  },
  {
   "backwardYaw": 32.28,
   "yaw": 18.74,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A"
  }
 ],
 "id": "panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_t.jpg",
 "overlays": [
  "this.overlay_15198E17_18E9_7A49_41B4_4242E4B1F2D4",
  "this.overlay_15A066E0_18E9_CBC7_417F_7930E63D2B78",
  "this.overlay_16CCB873_18EE_C6C9_41A4_DF3106262FEF",
  "this.overlay_1784F4B9_18EF_CFB9_41B5_37625EA635BC"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "displayPlaybackBar": true,
 "viewerArea": "this.MainViewer",
 "mouseControlMode": "drag_acceleration",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "class": "PanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true
},
{
 "partial": false,
 "label": "Maid room_001",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": 0.88,
   "yaw": -1.38,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E"
  },
  {
   "backwardYaw": 146.96,
   "yaw": 97.98,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A"
  }
 ],
 "id": "panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_t.jpg",
 "overlays": [
  "this.overlay_0896F882_191E_C64B_4182_E6EC6BF2AD0C",
  "this.overlay_0D0F3C76_191F_DEC8_41B3_108D34ECE7B2",
  "this.overlay_08B67CBC_191E_BFB8_41B7_8457E9E297E6",
  "this.overlay_0B798B50_1919_DAC8_41A7_3719D035EB0B"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_02DE7529_1966_CE59_4181_E7B1BE6B56A2",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -43.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_39DF83CE_1966_C9DB_41A7_A92493E1BA41",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 29.77,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Master Bedroom_001",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": 6.78,
   "yaw": -62.68,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52"
  },
  {
   "backwardYaw": -15.2,
   "yaw": 2.14,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD6F509_1656_2E57_41A8_1D8509221461"
  },
  {
   "backwardYaw": -165.81,
   "yaw": 128.37,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD97888_1652_2655_419E_D77E00E375D0"
  },
  {
   "backwardYaw": -139.05,
   "yaw": -145.21,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD4A113_1652_667A_41B3_C01836F650B0"
  }
 ],
 "id": "panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_t.jpg",
 "overlays": [
  "this.overlay_0B9E1A2E_191A_DA58_41B1_114F394A671A",
  "this.overlay_0D80C3C6_1919_49CB_41A2_52ECA56BF764",
  "this.overlay_0BEFEEFC_1926_DBBF_4199_765D4C8EB1E3",
  "this.overlay_0A6182DC_1927_4BFF_4188_1AA2A5051086",
  "this.overlay_0AD623AB_1927_4A58_41AF_7D4B75764CFF",
  "this.overlay_0D179DDB_1929_79F9_4196_4E0E8D0338F5",
  "this.overlay_0C3966B2_1929_CA4B_419E_5084F0EFD534",
  "this.overlay_0FCB3362_1929_4AC8_41AD_361B8CC48016"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "partial": false,
 "label": "Living_001",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": 11.56,
   "yaw": 136.92,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CD97888_1652_2655_419E_D77E00E375D0"
  },
  {
   "backwardYaw": 18.74,
   "yaw": 32.28,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B"
  }
 ],
 "id": "panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_t.jpg",
 "overlays": [
  "this.overlay_164A50A0_18EF_4647_4168_306817408220",
  "this.overlay_1511D74D_18EA_CAD9_41A5_2B2CCAB825D5",
  "this.overlay_1771D252_18EB_4AC8_41AA_946B8DEED5A5",
  "this.overlay_171B50CA_18E9_47DB_4195_E62A2E20BC7E"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_399AF386_1966_CA48_4184_69047A8FDD2D",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -79.76,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_3946E308_1966_CA47_41A6_BED60FD3FF5D",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -82.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_39A82348_1966_CAD8_418A_5A81492D3592",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 164.8,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1C2B843D_1652_2EAE_418A_146EAF582440_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_38147418_1966_CE47_41B5_ECA45AA9BDD8",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -59.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_39ED3395_1966_CA49_4189_82D1880827F8",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 116.29,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Commom Bathroom_002",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": 100.24,
   "yaw": 48.86,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1C2B843D_1652_2EAE_418A_146EAF582440"
  }
 ],
 "id": "panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_t.jpg",
 "overlays": [
  "this.overlay_0C374BD9_192B_B9F8_41A8_6810DC66F449",
  "this.overlay_0C824422_192B_4E4B_41A3_83A6343C490C"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "camera_02F434C4_1966_CFCF_41A0_FBEAAE11FAA1",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": -179.12,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "class": "PanoramaCamera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "yawSpeed": 7.96,
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence"
 },
 "id": "panorama_1CD4A113_1652_667A_41B3_C01836F650B0_camera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 }
},
{
 "partial": false,
 "label": "Master Bath_001",
 "hfov": 360,
 "hfovMin": "120%",
 "adjacentPanoramas": [
  {
   "backwardYaw": -145.21,
   "yaw": -139.05,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0"
  }
 ],
 "id": "panorama_1CD4A113_1652_667A_41B3_C01836F650B0",
 "pitch": 0,
 "frames": [
  {
   "thumbnailUrl": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_t.jpg",
   "front": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/f/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/r/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/b/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/d/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/l/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 6,
      "colCount": 6,
      "width": 3072,
      "tags": "ondemand",
      "height": 3072
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "colCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "height": 1536
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "colCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "height": 1024
     },
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0/u/3/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "colCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_t.jpg",
 "overlays": [
  "this.overlay_0D274BEE_192B_59DB_4192_67694DFD8482",
  "this.overlay_0CDB83DA_192A_C9F8_41A4_AA8B956429B8"
 ],
 "vfov": 180,
 "hfovMax": 130,
 "class": "Panorama"
},
{
 "playbackBarHeadShadow": true,
 "id": "MainViewer",
 "progressBottom": 0,
 "progressBackgroundOpacity": 1,
 "progressHeight": 10,
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarOpacity": 1,
 "toolTipFontStyle": "normal",
 "width": "100%",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "toolTipShadowOpacity": 1,
 "toolTipFontFamily": "Arial",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "vrPointerSelectionTime": 2000,
 "progressBarOpacity": 1,
 "propagateClick": false,
 "displayTooltipInTouchScreens": true,
 "toolTipShadowHorizontalLength": 0,
 "minHeight": 50,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipTextShadowOpacity": 0,
 "paddingRight": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "minWidth": 100,
 "progressBorderRadius": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "height": "100%",
 "toolTipShadowVerticalLength": 0,
 "toolTipFontColor": "#606060",
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadShadowBlurRadius": 3,
 "paddingBottom": 0,
 "playbackBarBottom": 5,
 "progressBackgroundColorDirection": "vertical",
 "toolTipBackgroundColor": "#F6F6F6",
 "progressBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "paddingLeft": 0,
 "progressBarBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "class": "ViewerArea",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingRight": 6,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderSize": 1,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "playbackBarHeight": 10,
 "toolTipDisplayTime": 600,
 "playbackBarHeadWidth": 6,
 "transitionDuration": 500,
 "playbackBarHeadShadowHorizontalLength": 0,
 "borderRadius": 0,
 "playbackBarRight": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "progressBarBorderSize": 0,
 "toolTipBorderRadius": 3,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarProgressBorderSize": 0,
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarBorderRadius": 0,
 "borderSize": 0,
 "playbackBarProgressBorderColor": "#000000",
 "transitionMode": "blending",
 "toolTipOpacity": 1,
 "playbackBarHeadBorderRadius": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "toolTipTextShadowColor": "#000000",
 "progressLeft": 0,
 "toolTipPaddingBottom": 4,
 "playbackBarProgressOpacity": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBorderSize": 0,
 "playbackBarBackgroundOpacity": 1,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontWeight": "normal",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "paddingTop": 0,
 "progressRight": 0,
 "data": {
  "name": "Main Viewer"
 },
 "playbackBarHeadShadowColor": "#000000",
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "shadow": false,
 "progressBarBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333"
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD97888_1652_2655_419E_D77E00E375D0, this.camera_38649427_1966_CE49_419E_CFB8FD421F91); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0_HS_0_1_0_map.gif",
      "width": 100,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -87.17,
   "hfov": 66.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.89
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0D82BCC7_1929_7FC8_41AD_AEB5CD0D2BA9",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.53,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_1_HS_1_0.png",
      "width": 171,
      "class": "ImageResourceLevel",
      "height": 171
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.82,
   "yaw": -86.55
  }
 ],
 "id": "overlay_0C3CD838_1929_C647_41B4_D694CE1111FE",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -86.55,
   "hfov": 7.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 1.82
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C, this.camera_02F7F4B5_1966_CE49_41A9_D4E2370480F8); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_0_HS_2_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 175
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 100.24,
   "hfov": 127.04,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.67
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0C0F5F49_1929_7AD9_4195_9ADA1AD9E477",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.5,
   "image": "this.AnimatedImageResource_0682E68E_1939_CA5B_41B6_D1DD4F682B3F",
   "yaw": 91.6,
   "pitch": -9.51,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0DB2AFA3_192B_7A49_41AA_7C23B5A8D626",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_1_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 91.6,
   "hfov": 6.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.51
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524, this.camera_397082F8_1966_CBC7_41B6_4BF00C851CD7); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0_HS_0_1_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 90,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0_HS_0_2_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -180,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0B061BB9_191A_B9B9_41A2_090866F82113",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.43,
   "image": "this.AnimatedImageResource_0687D68B_1939_CA59_41A0_34B6683D0B6A",
   "yaw": 145.36,
   "pitch": 12.59,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0B1DF81E_191B_4678_41B3_733B9177AC1E",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_1_HS_1_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 145.36,
   "hfov": 6.43,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 12.59
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524, this.camera_3946E308_1966_CA47_41A6_BED60FD3FF5D); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0_HS_2_1_2_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -180,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0_HS_2_2_3_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -90,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0_HS_2_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_0_HS_2_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0A83A46A_191B_4EDB_41B0_AC66641513F1",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0, this.camera_02C3F4F3_1966_CFC9_41B2_D88054EA8C5E); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_0_HS_0_1_0_map.gif",
      "width": 112,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -15.2,
   "hfov": 82.95,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.69
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0AC2DD46_192B_7ECB_41AE_9D05C9AF4508",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.49,
   "image": "this.AnimatedImageResource_0681068D_1939_CA59_4142_A5C65EC28804",
   "yaw": -12.62,
   "pitch": -7.22,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0DC16038_192B_46B8_419F_FBF9F037EC56",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -12.62,
   "hfov": 3.49,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.22
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD97888_1652_2655_419E_D77E00E375D0, this.camera_39ED3395_1966_CA49_4189_82D1880827F8); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_0_HS_0_1_0_map.gif",
      "width": 88,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -143.57,
   "hfov": 33.57,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.13
  }
 ],
 "useHandCursor": true,
 "id": "overlay_082EE8D7_191B_47C9_41A0_10783280B928",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.51,
   "image": "this.AnimatedImageResource_0686568A_1939_CA5B_41AC_A14745183559",
   "yaw": -136.96,
   "pitch": -3.23,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_087287D1_1919_49C9_41B4_915BF5EB820F",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -136.96,
   "hfov": 3.51,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.23
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0, this.camera_02F9D4E4_1966_CFCF_4190_85210C502E97); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_0_HS_0_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 183
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 6.78,
   "hfov": 115.15,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.28
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0AFF3900_1929_4647_41B8_D6CF16B98EE2",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.5,
   "image": "this.AnimatedImageResource_0680F68D_1939_CA59_419C_A92DA68AEAB4",
   "yaw": -22.12,
   "pitch": -5.62,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0F0A7B0F_192A_BA59_41B6_C83E54D58A1C",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -22.12,
   "hfov": 3.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.62
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B, this.camera_3802B408_1966_CE47_41B8_BF5E84B1D2AC); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_1_HS_0_1_0_map.gif",
      "width": 75,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -150.23,
   "hfov": 70.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.12
  }
 ],
 "useHandCursor": true,
 "id": "overlay_179E882F_18E9_4659_41A4_DDC226A6E91B",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B, this.camera_38147418_1966_CE47_41B5_ECA45AA9BDD8); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_1_HS_1_1_0_map.gif",
      "width": 66,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 155.25,
   "hfov": 63.88,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.43
  }
 ],
 "useHandCursor": true,
 "id": "overlay_17F510AB_18E6_C659_41B0_139D9CDB5C46",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.5,
   "image": "this.AnimatedImageResource_069A8688_1939_CA47_41AB_B23928BF835D",
   "yaw": -159.06,
   "pitch": -5.34,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_17F613B5_18E7_4A48_4171_8CB1FC8368E2",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_1_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -159.06,
   "hfov": 3.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.34
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524, this.camera_383203F7_1966_C9C9_41B7_EB72D416D15B); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_1_HS_3_1_0_map.gif",
      "width": 114,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0.88,
   "hfov": 31.3,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -11.05
  }
 ],
 "useHandCursor": true,
 "id": "overlay_17D24CE7_18F9_BFC9_41B7_46762F55D56B",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.51,
   "image": "this.AnimatedImageResource_391012C0_1966_CBC7_4170_E0B2FE453D00",
   "yaw": 0.22,
   "pitch": -3.23,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_08F9830E_18FA_CA5B_41A2_73693CC0D036",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_1_HS_4_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0.22,
   "hfov": 3.51,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.23
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0, this.camera_02CED50B_1966_CE59_41B6_09B46068D678); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0_HS_0_1_0_map.gif",
      "width": 91,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -63.71,
   "hfov": 75.02,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.86
  }
 ],
 "useHandCursor": true,
 "id": "overlay_17864508_18EB_4E47_41B8_7D5C9F6EE882",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1C2B843D_1652_2EAE_418A_146EAF582440, this.camera_0529D545_1966_CEC9_4185_F68B28E7338C); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0_HS_1_1_0_map.gif",
      "width": 86,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 116.16,
   "hfov": 57.15,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.32
  }
 ],
 "useHandCursor": true,
 "id": "overlay_08CE8ED3_18EA_BBC8_418E_5148AD89FAD1",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD8D112_1652_667A_4197_E2457EFAFABF, this.camera_0524E537_1966_CE49_41AA_581AF53B58D9); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0_HS_2_1_0_map.gif",
      "width": 51,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 152.74,
   "hfov": 25.64,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -12.62
  }
 ],
 "useHandCursor": true,
 "id": "overlay_084331DE_18EA_C9FB_419A_429DD68E13C6",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0, this.camera_02C8951A_1966_CE7B_41B2_291C594E6D26); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0_HS_3_1_0_map.gif",
      "width": 89,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -165.81,
   "hfov": 29.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.3
  }
 ],
 "useHandCursor": true,
 "id": "overlay_098F8D2F_18E9_BE59_41AC_43FE3C8F0777",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.58,
   "image": "this.AnimatedImageResource_06843689_1939_CA59_41AC_A982675157ED",
   "yaw": -62.9,
   "pitch": 3.55,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_09A92CE2_18EB_BFCB_41B8_42C1F0861C86",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_1_HS_4_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -62.9,
   "hfov": 6.58,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3.55
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.59,
   "image": "this.AnimatedImageResource_0684F689_1939_CA59_41B5_478B34B12A59",
   "yaw": -166.15,
   "pitch": -1.22,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_091F83CF_18EB_C9D8_4195_FD7DB7DA3B79",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_1_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -166.15,
   "hfov": 6.59,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.22
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.27,
   "image": "this.AnimatedImageResource_06854689_1939_CA59_41B1_F5964BC3FB78",
   "yaw": 152.24,
   "pitch": -0.81,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0AC638CD_18EB_C7D8_41A6_5A6AA0C7D74A",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_1_HS_6_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 152.24,
   "hfov": 5.27,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.81
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 5.71,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_1_HS_7_0.png",
      "width": 130,
      "class": "ImageResourceLevel",
      "height": 130
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -0.43,
   "yaw": 118.79
  }
 ],
 "id": "overlay_0A6CD4FE_191A_CFBB_4184_1C8B45B8DF36",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_1_HS_7_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 118.79,
   "hfov": 5.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.43
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A, this.camera_02DE7529_1966_CE59_4181_E7B1BE6B56A2); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0_HS_8_1_0_map.gif",
      "width": 157,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 11.56,
   "hfov": 97.15,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.49
  }
 ],
 "useHandCursor": true,
 "id": "overlay_051EB997_192F_4649_41B0_4E7DCC59B2F9",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.07,
   "image": "this.AnimatedImageResource_053BB8DB_1919_47F9_41B0_1C473AB25538",
   "yaw": 16.42,
   "pitch": -3.89,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_05A7C94C_192F_C6DF_41A2_3EE063672AC8",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0_HS_9_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 16.42,
   "hfov": 3.07,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.89
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD97888_1652_2655_419E_D77E00E375D0, this.camera_3952D327_1966_CA48_41A3_3BB3EFC2CA91); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_0_HS_0_1_0_map.gif",
      "width": 96,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 5.28,
   "hfov": 42.08,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.08
  }
 ],
 "useHandCursor": true,
 "id": "overlay_08240E59_18E9_DAF8_41B3_3F0B6692C3ED",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.71,
   "image": "this.AnimatedImageResource_0685E689_1939_CA59_418E_52ED5EF3242A",
   "yaw": 7.25,
   "pitch": 0.47,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_099CFBA6_18E9_5A48_419B_9144BE867098",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 7.25,
   "hfov": 5.71,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.47
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A, this.camera_3821B3E3_1966_C9C9_41B2_421CCEC2F767); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_1_HS_0_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_1_HS_0_2_1_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 90,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_1_HS_0_3_4_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 90
  },
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_1_HS_0_4_5_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 0,
   "hfov": 90,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -90
  }
 ],
 "useHandCursor": true,
 "id": "overlay_15198E17_18E9_7A49_41B4_4242E4B1F2D4",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E, this.camera_39DF83CE_1966_C9DB_41A7_A92493E1BA41); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_0_HS_1_1_6_map.gif",
      "width": 124,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 120.84,
   "hfov": 64.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -9.11
  }
 ],
 "useHandCursor": true,
 "id": "overlay_15A066E0_18E9_CBC7_417F_7930E63D2B78",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 2.61,
   "image": "this.AnimatedImageResource_391202BA_1966_CBBB_41B3_65A3FBC1498A",
   "yaw": 32.05,
   "pitch": -7.66,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_16CCB873_18EE_C6C9_41A4_DF3106262FEF",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_1_HS_2_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 32.05,
   "hfov": 2.61,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.66
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.46,
   "image": "this.AnimatedImageResource_06997686_1939_CA4B_417F_046C2C430B72",
   "yaw": 102.52,
   "pitch": -10,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_1784F4B9_18EF_CFB9_41B5_37625EA635BC",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_1_HS_3_0_6_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 102.52,
   "hfov": 3.46,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E, this.camera_02F434C4_1966_CFCF_41A0_FBEAAE11FAA1); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_0_HS_0_1_0_map.gif",
      "width": 107,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -1.38,
   "hfov": 55.16,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.98
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0896F882_191E_C64B_4182_E6EC6BF2AD0C",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.27,
   "image": "this.AnimatedImageResource_0686E68A_1939_CA5B_4169_5B632C7A4CBC",
   "yaw": 1.45,
   "pitch": -2.84,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0D0F3C76_191F_DEC8_41B3_108D34ECE7B2",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 1.45,
   "hfov": 5.27,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -2.84
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A, this.camera_02FE84D4_1966_CFCF_4189_A11F7B298E2D); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_1_HS_2_1_0_map.gif",
      "width": 158,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 97.98,
   "hfov": 106.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.33
  }
 ],
 "useHandCursor": true,
 "id": "overlay_08B67CBC_191E_BFB8_41B7_8457E9E297E6",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 5.26,
   "image": "this.AnimatedImageResource_0687468A_1939_CA5B_41A4_3324BA7AE7F5",
   "yaw": 95.61,
   "pitch": 4.7,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0B798B50_1919_DAC8_41A7_3719D035EB0B",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_1_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 95.61,
   "hfov": 5.26,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 4.7
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD97888_1652_2655_419E_D77E00E375D0, this.camera_39BA3360_1966_CAC8_41B8_36D6E57ADE05); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0_HS_0_1_0_map.gif",
      "width": 69,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 128.37,
   "hfov": 50.29,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -14.51
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0B9E1A2E_191A_DA58_41B1_114F394A671A",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.59,
   "image": "this.AnimatedImageResource_0680268B_1939_CA59_4183_CA0447897C56",
   "yaw": 130.79,
   "pitch": 0.03,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0D80C3C6_1919_49CB_41A2_52ECA56BF764",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 130.79,
   "hfov": 6.59,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.03
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD6F509_1656_2E57_41A8_1D8509221461, this.camera_39A82348_1966_CAD8_418A_5A81492D3592); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0_HS_2_1_0_map.gif",
      "width": 80,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 2.14,
   "hfov": 36.81,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.59
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0BEFEEFC_1926_DBBF_4199_765D4C8EB1E3",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52, this.camera_39A75338_1966_CAB8_4176_AB72BB9A570A); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0_HS_3_1_0_map.gif",
      "width": 97,
      "class": "ImageResourceLevel",
      "height": 199
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -62.68,
   "hfov": 32.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.73
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0A6182DC_1927_4BFF_4188_1AA2A5051086",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.46,
   "image": "this.AnimatedImageResource_0687C68C_1939_CA5F_41A6_22C8A9F732CA",
   "yaw": -3.94,
   "pitch": -10.51,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0AD623AB_1927_4A58_41AF_7D4B75764CFF",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_1_HS_4_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -3.94,
   "hfov": 3.46,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.51
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.5,
   "image": "this.AnimatedImageResource_0687968C_1939_CA5F_4185_68ABCFA55908",
   "yaw": -53.58,
   "pitch": -6.19,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0D179DDB_1929_79F9_4196_4E0E8D0338F5",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_1_HS_5_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -53.58,
   "hfov": 3.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -6.19
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD4A113_1652_667A_41B3_C01836F650B0, this.camera_398A4376_1966_CAC8_41B5_56FA11C86FE5); this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_0_HS_6_1_0_map.gif",
      "width": 57,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -145.21,
   "hfov": 12.63,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -8.86
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0C3966B2_1929_CA4B_419E_5084F0EFD534",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.38,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_1_HS_7_0.png",
      "width": 100,
      "class": "ImageResourceLevel",
      "height": 100
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.82,
   "yaw": -145.52
  }
 ],
 "id": "overlay_0FCB3362_1929_4AC8_41AD_361B8CC48016",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_1_HS_7_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -145.52,
   "hfov": 4.38,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.82
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CD97888_1652_2655_419E_D77E00E375D0, this.camera_39FD33AC_1966_CA5F_41B2_87B88B2B3775); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0_HS_0_1_0_map.gif",
      "width": 104,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 136.92,
   "hfov": 64.48,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 0.43
  }
 ],
 "useHandCursor": true,
 "id": "overlay_164A50A0_18EF_4647_4168_306817408220",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B, this.camera_39CF13BC_1966_C9BF_4183_3E3680B6E91E); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0_HS_1_1_0_map.gif",
      "width": 200,
      "class": "ImageResourceLevel",
      "height": 196
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 32.28,
   "hfov": 103.34,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 1.71
  }
 ],
 "useHandCursor": true,
 "id": "overlay_1511D74D_18EA_CAD9_41A5_2B2CCAB825D5",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.08,
   "image": "this.AnimatedImageResource_0699A687_1939_CA49_41B2_AC3102B3CE8F",
   "yaw": 12.61,
   "pitch": -0.7,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_1771D252_18EB_4AC8_41AA_946B8DEED5A5",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_1_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 12.61,
   "hfov": 3.08,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.7
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 3.95,
   "image": "this.AnimatedImageResource_3A3CB82D_1919_4658_417D_A0F459D01D4A",
   "yaw": 138.43,
   "pitch": -3.19,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_171B50CA_18E9_47DB_4195_E62A2E20BC7E",
 "data": {
  "label": "Circle 03c"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 138.43,
   "hfov": 3.95,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -3.19
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1C2B843D_1652_2EAE_418A_146EAF582440, this.camera_399AF386_1966_CA48_4184_69047A8FDD2D); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_0_HS_0_1_0_map.gif",
      "width": 181,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 48.86,
   "hfov": 115.92,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -13.4
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0C374BD9_192B_B9F8_41A8_6810DC66F449",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 6.53,
   "image": "this.AnimatedImageResource_0683568E_1939_CA5B_41A6_E286BDFFB867",
   "yaw": 28.04,
   "pitch": -7.76,
   "distance": 100,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_0C824422_192B_4E4B_41A3_83A6343C490C",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 28.04,
   "hfov": 6.53,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -7.76
  }
 ],
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0, this.camera_394DD318_1966_CA47_41B7_D02EFCD45EE6); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_0_HS_0_1_0_map.gif",
      "width": 111,
      "class": "ImageResourceLevel",
      "height": 200
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -139.05,
   "hfov": 61.21,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -17.69
  }
 ],
 "useHandCursor": true,
 "id": "overlay_0D274BEE_192B_59DB_4192_67694DFD8482",
 "data": {
  "label": "Polygon"
 },
 "rollOverDisplay": false
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.54,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_1_HS_1_0.png",
      "width": 171,
      "class": "ImageResourceLevel",
      "height": 171
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -0.94,
   "yaw": -137.54
  }
 ],
 "id": "overlay_0CDB83DA_192A_C9F8_41A4_AA8B956429B8",
 "data": {
  "label": "Circle Door 02"
 },
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_1CD4A113_1652_667A_41B3_C01836F650B0_1_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -137.54,
   "hfov": 7.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.94
  }
 ],
 "rollOverDisplay": false
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0682E68E_1939_CA5B_41B6_D1DD4F682B3F",
 "levels": [
  {
   "url": "media/panorama_1C2B843D_1652_2EAE_418A_146EAF582440_1_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0687D68B_1939_CA59_41A0_34B6683D0B6A",
 "levels": [
  {
   "url": "media/panorama_1CD77597_1652_2E7A_41B0_311D20F0EF6A_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0681068D_1939_CA59_4142_A5C65EC28804",
 "levels": [
  {
   "url": "media/panorama_1CD6F509_1656_2E57_41A8_1D8509221461_1_HS_1_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0686568A_1939_CA5B_41AC_A14745183559",
 "levels": [
  {
   "url": "media/panorama_1CD679A5_1652_665F_41AB_0CFBFA9771E0_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0680F68D_1939_CA59_419C_A92DA68AEAB4",
 "levels": [
  {
   "url": "media/panorama_1CDB49F0_1656_19B5_41B6_0F648F449E52_1_HS_1_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_069A8688_1939_CA47_41AB_B23928BF835D",
 "levels": [
  {
   "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_1_HS_2_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_391012C0_1966_CBC7_4170_E0B2FE453D00",
 "levels": [
  {
   "url": "media/panorama_1CDAB384_1652_2A5E_4196_F919EDB00B4E_1_HS_4_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_06843689_1939_CA59_41AC_A982675157ED",
 "levels": [
  {
   "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_1_HS_4_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0684F689_1939_CA59_41B5_478B34B12A59",
 "levels": [
  {
   "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_1_HS_5_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_06854689_1939_CA59_41B1_F5964BC3FB78",
 "levels": [
  {
   "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_1_HS_6_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_053BB8DB_1919_47F9_41B0_1C473AB25538",
 "levels": [
  {
   "url": "media/panorama_1CD97888_1652_2655_419E_D77E00E375D0_0_HS_9_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0685E689_1939_CA59_418E_52ED5EF3242A",
 "levels": [
  {
   "url": "media/panorama_1CD8D112_1652_667A_4197_E2457EFAFABF_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_391202BA_1966_CBBB_41B3_65A3FBC1498A",
 "levels": [
  {
   "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_1_HS_2_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_06997686_1939_CA4B_417F_046C2C430B72",
 "levels": [
  {
   "url": "media/panorama_1CDAEC34_1652_1EBD_41B4_246BF781AD2B_1_HS_3_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0686E68A_1939_CA5B_4169_5B632C7A4CBC",
 "levels": [
  {
   "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0687468A_1939_CA5B_41A4_3324BA7AE7F5",
 "levels": [
  {
   "url": "media/panorama_1CD495C1_1652_E9D6_417E_8B4D690BA524_1_HS_3_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0680268B_1939_CA59_4183_CA0447897C56",
 "levels": [
  {
   "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0687C68C_1939_CA5F_41A6_22C8A9F732CA",
 "levels": [
  {
   "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_1_HS_4_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0687968C_1939_CA5F_4185_68ABCFA55908",
 "levels": [
  {
   "url": "media/panorama_1CDA75FD_1652_29AF_41B4_AE3A876A93D0_1_HS_5_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0699A687_1939_CA49_41B2_AC3102B3CE8F",
 "levels": [
  {
   "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_1_HS_2_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 22,
 "frameDuration": 41,
 "id": "AnimatedImageResource_3A3CB82D_1919_4658_417D_A0F459D01D4A",
 "levels": [
  {
   "url": "media/panorama_1CD76DC4_1653_F9DE_41B5_BA7089A0C34A_0_HS_3_0.png",
   "width": 1000,
   "class": "ImageResourceLevel",
   "height": 1500
  }
 ],
 "rowCount": 6,
 "colCount": 4
},
{
 "class": "AnimatedImageResource",
 "frameCount": 24,
 "frameDuration": 41,
 "id": "AnimatedImageResource_0683568E_1939_CA5B_41A6_E286BDFFB867",
 "levels": [
  {
   "url": "media/panorama_1CF2721F_1652_2A6A_4153_AD2934F4932C_1_HS_1_0.png",
   "width": 800,
   "class": "ImageResourceLevel",
   "height": 1200
  }
 ],
 "rowCount": 6,
 "colCount": 4
}],
 "mobileMipmappingEnabled": false,
 "paddingBottom": 0,
 "paddingLeft": 0,
 "downloadEnabled": false,
 "verticalAlign": "top",
 "desktopMipmappingEnabled": false,
 "contentOpaque": false,
 "class": "Player",
 "mouseWheelEnabled": true,
 "data": {
  "name": "Player486"
 }
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
