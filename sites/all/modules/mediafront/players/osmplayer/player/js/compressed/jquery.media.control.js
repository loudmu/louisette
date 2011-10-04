/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com 
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{volumeVertical:false});jQuery.media.ids=jQuery.extend(jQuery.media.ids,{currentTime:"#mediacurrenttime",totalTime:"#mediatotaltime",playPause:"#mediaplaypause",seekUpdate:"#mediaseekupdate",seekProgress:"#mediaseekprogress",seekBar:"#mediaseekbar",seekHandle:"#mediaseekhandle",volumeUpdate:"#mediavolumeupdate",volumeBar:"#mediavolumebar",volumeHandle:"#mediavolumehandle",mute:"#mediamute"});jQuery.fn.mediacontrol=function(b){if(this.length===0){return null;}return new (function(e,c){c=jQuery.media.utils.getSettings(c);this.display=e;var f=this;this.formatTime=(c.template&&c.template.formatTime)?c.template.formatTime:function(j){j=j?j:0;var k=0;var h=0;var g=0;g=Math.floor(j/3600);j-=(g*3600);h=Math.floor(j/60);j-=(h*60);k=Math.floor(j%60);var i="";if(g){i+=String(g);i+=":";}i+=(h>=10)?String(h):("0"+String(h));i+=":";i+=(k>=10)?String(k):("0"+String(k));return{time:i,units:""};};this.setToggle=function(h,i){var g=i?".on":".off";var j=i?".off":".on";if(h){h.find(g).show();h.find(j).hide();}};var d=this.formatTime(0);this.duration=0;this.volume=-1;this.prevVolume=0;this.percentLoaded=0;this.playState=false;this.muteState=false;this.currentTime=e.find(c.ids.currentTime).text(d.time);this.totalTime=e.find(c.ids.totalTime).text(d.time);this.display.find("a.mediaplayerlink").each(function(){var g=a(this).attr("href");a(this).medialink(c,function(h){h.preventDefault();f.display.trigger(h.data.id);},{id:g.substr(1),obj:a(this)});});this.playPauseButton=e.find(c.ids.playPause).medialink(c,function(g,h){f.playState=!f.playState;f.setToggle(h,f.playState);f.display.trigger("controlupdate",{type:(f.playState?"pause":"play")});});this.seekUpdate=e.find(c.ids.seekUpdate).css("width",0);this.seekProgress=e.find(c.ids.seekProgress).css("width",0);this.seekBar=e.find(c.ids.seekBar).mediaslider(c.ids.seekHandle,false);if(this.seekBar){this.seekBar.display.unbind("setvalue").bind("setvalue",function(g,h){f.seekUpdate.css("width",(h*f.seekBar.trackSize)+"px");f.display.trigger("controlupdate",{type:"seek",value:(h*f.duration)});});this.seekBar.display.unbind("updatevalue").bind("updatevalue",function(g,h){f.seekUpdate.css("width",(h*f.seekBar.trackSize)+"px");});}this.setVolume=function(g){if(this.volumeBar){if(c.volumeVertical){this.volumeUpdate.css({marginTop:(this.volumeBar.handlePos+this.volumeBar.handleMid),height:(this.volumeBar.trackSize-this.volumeBar.handlePos)});}else{this.volumeUpdate.css("width",(g*this.volumeBar.trackSize));}}};this.volumeUpdate=e.find(c.ids.volumeUpdate);this.volumeBar=e.find(c.ids.volumeBar).mediaslider(c.ids.volumeHandle,c.volumeVertical,c.volumeVertical);if(this.volumeBar){this.volumeBar.display.unbind("setvalue").bind("setvalue",function(g,h){f.setVolume(h);f.display.trigger("controlupdate",{type:"volume",value:h});});this.volumeBar.display.unbind("updatevalue").bind("updatevalue",function(g,h){f.setVolume(h);f.volume=h;});}this.mute=e.find(c.ids.mute).medialink(c,function(g,h){f.muteState=!f.muteState;f.setToggle(h,f.muteState);f.setMute(f.muteState);});this.setMute=function(g){this.prevVolume=(this.volumeBar.value>0)?this.volumeBar.value:this.prevVolume;this.volumeBar.updateValue(g?0:this.prevVolume);this.display.trigger("controlupdate",{type:"mute",value:g});};this.setProgress=function(g){if(this.seekProgress&&this.seekBar){this.seekProgress.css("width",(g*(this.seekBar.trackSize+this.seekBar.handleSize)));}};this.onResize=function(){if(this.seekBar){this.seekBar.onResize();}this.setProgress(this.percentLoaded);};this.onMediaUpdate=function(g){switch(g.type){case"reset":this.reset();break;case"paused":this.playState=true;this.setToggle(this.playPauseButton.display,this.playState);break;case"playing":this.playState=false;this.setToggle(this.playPauseButton.display,this.playState);break;case"stopped":this.playState=true;this.setToggle(this.playPauseButton.display,this.playState);break;case"progress":this.percentLoaded=g.percentLoaded;this.setProgress(this.percentLoaded);break;case"meta":case"update":this.timeUpdate(g.currentTime,g.totalTime);if(this.volumeBar){this.volumeBar.updateValue(g.volume);}break;default:break;}};this.reset=function(){this.totalTime.text(this.formatTime(0).time);this.currentTime.text(this.formatTime(0).time);if(this.seekBar){this.seekBar.updateValue(0);}this.seekUpdate.css("width","0px");this.seekProgress.css("width","0px");};this.timeUpdate=function(g,h){this.duration=h;this.totalTime.text(this.formatTime(h).time);this.currentTime.text(this.formatTime(g).time);if(h&&this.seekBar&&!this.seekBar.dragging){this.seekBar.updateValue(g/h);}};this.timeUpdate(0,0);})(this,b);};})(jQuery);