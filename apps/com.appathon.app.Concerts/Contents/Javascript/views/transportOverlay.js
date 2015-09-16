// Create a class and extended it from the MAF.system.FullscreenView
var transportOverlay = new MAF.Class({
	Extends: MAF.system.FullscreenView,

	ClassName: 'transportOverlay',

	// Add back params when going to the previous view
	viewBackParams: {
		reset: false
	},

	// Initialize your view
	initialize: function () {
		this.parent(); // Call super class constructor
		MAF.mediaplayer.init(); // Initialize mediaplayer
	},

	// Create your view template
	createView: function () {
		// Reference to the current view

		var view = this,
			// Create the Media Transport Overlay 
			mediaTransportOverlay = new MAF.control.MediaTransportOverlay({
				ClassName: 'TrickPlay',
				theme: false,
				buttonOrder: ['rewindButton', 'playButton', 'stopButton', 'forwardButton'], // Set the order of the buttons
				buttonOffset: 0, // Set the default space before and after the buttons
				buttonSpacing: 0, // Set the space between the buttons
				fadeTimeout: 5, // Set the fader of the overlay to start after 6 seconds
				playButton: true, // Enable the "play" button
				stopButton: false, // Disable the "stop" button
				rewindButton: true, // Enable the "rewind" button
				forwardButton: true // Enable the "fast forward" button
			}).appendTo(view);

		var bigSize = 26;
		var t1Size = 16;
		var t2Size = 14;
		var dividerTop = (view.height - 100) + 0.5*bigSize + 5;
		var navId = this.persist.id;
		var okBtn = new MAF.control.TextButton({
			label: "OK",
			ClassName: "YTButton",
			events:{
				onSelect: function () {
					log("select - going to "+navId);
					MAF.application.loadView('view-ArtistEvents', { id: navId });
				}
			},
			styles: {
				top: view.height - 100,
				left: view.width - 667,
				width: 67,
				height: 72,
				fontSize: bigSize
			},
			textStyles: {
				anchorStyle: "center",
				width: "inherit",
				height: "inherit"
			}
		}).appendTo(view);			

		setTimeout(function() {
			okBtn.focus();
		}, 6000);

		var btn = new MAF.element.Text({
			label: "",
			styles: {
				top: view.height - 100,
				left: view.width - 600,
				width: 369,
				height: 72,
				backgroundColor: "rgba(0, 0, 0, 0.7)",
				fontSize: 30
			}
		}).appendTo(view);

		new MAF.element.Text({
			label: "Friday April 2nd Live at Ziggo Dome",
			styles: {
				top: 17,
				width: 369,
				height: 20,
				fontSize: t1Size,
				color: "#5d5d5d",
				anchorStyle: "center"
			}
		}).appendTo(btn);

		new MAF.element.Text({
			label: "6 Friends Are Going",
			styles: {
				top: 42,
				width: 369,
				height: 16,
				fontSize: t2Size,
				color: "#5d5d5d",
				anchorStyle: "center"
			}
		}).appendTo(btn);		

		new MAF.element.Text({
			label: ">",
			styles: {
				top: view.height - 100,
				left: view.width - 231,
				width: 67,
				height: 72,
				color: "#5d5d5d",
				backgroundColor: "rgba(0, 0, 0, 0.7)",
				fontSize: bigSize,
				anchorStyle: "center"
			}
		}).appendTo(view);

		new MAF.element.Text({
			label: "",
			styles: {
				top: dividerTop,
				left: view.width - 600,
				width: 1,
				height: 30,
				backgroundColor: "#5d5d5d"
			}
		}).appendTo(view);			

		new MAF.element.Text({
			label: "",
			styles: {
				top: dividerTop,
				left: view.width - 231,
				width: 1,
				height: 30,
				backgroundColor: "#5d5d5d"
			}
		}).appendTo(view);		
	},

	gotKeyPress: function (event) {
		if (event.payload.key === 'stop')
			MAF.application.previousView();
	},

	// The channelChanged function is called when you change the channel of your TV 
	onChannelChanged: function () {
		MAF.application.previousView();
	},

	// When view is created or returning to view the view is updated
	updateView: function () {
		// Reference to the current view
		var view = this;

		view.onChannelChanged.subscribeTo(MAF.mediaplayer, 'onChannelChange');
		view.gotKeyPress.subscribeTo(MAF.application, 'onWidgetKeyPress');

		log('create video: https://www.youtube.com/watch?v='+this.persist.id);

		YouTube.get(this.persist.id, function(config) {
			MAF.mediaplayer.playlist.set((new MAF.media.Playlist()).addEntry(new MAF.media.PlaylistEntry(config)));
			MAF.mediaplayer.playlist.start();
		});
	},

	// The hideView is called when you're leaving this view
	hideView: function () {
		// Reference to the current view
		var view = this;
		view.onChannelChanged.unsubscribeFrom(MAF.mediaplayer, 'onChannelChange');
		view.gotKeyPress.unsubscribeFrom(MAF.application, 'onWidgetKeyPress');
	}
});