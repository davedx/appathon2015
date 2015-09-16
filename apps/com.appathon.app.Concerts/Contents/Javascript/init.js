include('Javascript/core/theme.js');
include('Javascript/views/MainView.js');
include('Javascript/views/ArtistEvents.js');
include('Javascript/views/transportOverlay.js');

MAF.application.init({
	views: [
		{ id: 'view-MainView', viewClass: MainView },
		{ id: 'view-transportOverlay', viewClass: transportOverlay },
		{ id: 'view-ArtistEvents', viewClass: ArtistEvents },
		{ id: 'view-About', viewClass: MAF.views.AboutBox }
	],
	defaultViewId: 'view-MainView',
	settingsViewId: 'view-About'
});