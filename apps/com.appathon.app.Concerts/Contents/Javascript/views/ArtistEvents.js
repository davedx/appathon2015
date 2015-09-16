var fakeEvents = [{
	title: "Kensington - Pinkpop",
	date: "Jun 14th, Landgraaf",
	image: "./images/kensington.jpg",
	friends: {
		title: "4 Friends Are Going",
		friends: ["Dave", "Dave"]
	}
}, {
	title: "Kensington - Ancienne Belgique",
	date: "November 13th, Brussels",
	image: "./images/kensington.jpg",
	friends: {
		title: "4 Friends Are Going",
		friends: ["Dave", "Dave"]
	}
}, {
	title: "Kensington - Ziggo Dome",
	date: "November 25th, Amsterdam",
	image: "./images/kensington.jpg",
	friends: {
		title: "4 Friends Are Going",
		friends: ["Dave", "Dave"]
	}
}];

var ArtistEvents = new MAF.Class({
	ClassName: 'ArtistEventsView',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var view = this;

		new MAF.element.Text({
			label: "",
			styles: {
				top: 40,
				left: 40,
				width: view.width - 80,
				height: view.height - 80,
				backgroundColor: "rgba(0, 0, 0, 0.7)"
			}
		}).appendTo(view);

		new MAF.element.Text({
			label: "EVENTS",
			styles: {
				top: 80,
				left: 80,
				fontSize: 35,
				color: "#5d5d5d"
			}
		}).appendTo(view);
//660x155
		var elementGrid = view.elements.elementGrid = new MAF.element.Grid({
			rows: 3,
			columns: 1,
			styles: {
				width: view.width - 800,
				height: view.height - 300,
				hOffset: 80,
				vOffset: 187
			},
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events:{
						onSelect: function () {
							//MAF.application.loadView('view-transportOverlay', { id: this.ytid });
							//TODO: buy action
						},
						onFocus: function () {
							this.animate({backgroundColor: 'white',	duration: 0.3});
							this.title.animate({duration: 0.3, color: 'black'});
							this.date.animate({duration: 0.3, color: 'black'});
							this.friendsTitle.animate({duration: 0.3, color: 'black'});
							this.divider.show();
							this.buyButton.show();
							this.buyButtonLabel.show();
							this.inviteButton.show();
							this.inviteButtonLabel.show();
						},
						onBlur: function () {
							this.animate({backgroundColor: null, duration: 0.3});
							this.title.animate({duration: 0.3, color: '#5d5d5d'});
							this.date.animate({duration: 0.3, color: '#5d5d5d'});
							this.friendsTitle.animate({duration: 0.3, color: '#5d5d5d'});
							this.divider.hide();
							this.buyButton.hide();
							this.buyButtonLabel.hide();
							this.inviteButton.hide();
							this.inviteButtonLabel.hide();
						}
					}
				});

				cell.title = new MAF.element.Text({
					styles: {
						width: cell.width - 250,
						height: 40,
						color: '#5d5d5d',
						fontSize: 30,
						hOffset: cell.height + 50,
						vOffset: 20,
						wrap: true
					}
				}).appendTo(cell);

				cell.date = new MAF.element.Text({
					styles: {
						width: cell.width - 250,
						height: 35,
						color: '#5d5d5d',
						fontSize: 25,
						hOffset: cell.height + 50,
						vOffset: 80,
						wrap: true
					}
				}).appendTo(cell);

				cell.friendsTitle = new MAF.element.Text({
					styles: {
						width: cell.width - 250,
						height: 50,
						color: '#5d5d5d',
						fontSize: 20,
						hOffset: cell.height + 50,
						vOffset: 140,
						wrap: true
					}
				}).appendTo(cell);

				cell.image = new MAF.element.Image({
					styles: {
						width: cell.height,
						height: cell.height
					}
				}).appendTo(cell);

				var buttonSize = cell.height/3;
				cell.divider = new MAF.element.Text({
					label: "",
					styles: {
						top: 20,
						left: cell.width - (buttonSize+50),
						width: 2,
						height: cell.height - 40,
						backgroundColor: "#5d5d5d",
						visible: false
					}
				}).appendTo(cell);

				cell.buyButton = new MAF.element.Text({
					label: "OK",
					styles: {
						top: 20,
						left: cell.width - (buttonSize+20),
						width: buttonSize,
						height: buttonSize,
						fontSize: 30,
						backgroundColor: '#5d5d5d',
						color: 'white',
						anchorStyle: "center",
						visible: false
					}
				}).appendTo(cell);

				cell.buyButtonLabel = new MAF.element.Text({
					label: "Buy tickets",
					styles: {
						top: 20 + buttonSize + 2,
						left: cell.width - (buttonSize+20),
						width: buttonSize,
						height: 20,
						fontSize: 16,
						color: '#5d5d5d',
						anchorStyle: "center",
						visible: false
					}
				}).appendTo(cell);				

				cell.inviteButton = new MAF.element.Text({
					label: ">",
					styles: {
						top: cell.height - buttonSize - 33,
						left: cell.width - (buttonSize+20),
						width: buttonSize,
						height: buttonSize,
						fontSize: 30,
						backgroundColor: '#5d5d5d',
						color: 'white',
						anchorStyle: "center",
						visible: false
					}
				}).appendTo(cell);

				cell.inviteButtonLabel = new MAF.element.Text({
					label: "Tell friends",
					styles: {
						top: cell.height - 30,
						left: cell.width - (buttonSize+20),
						width: buttonSize,
						height: 20,
						fontSize: 16,
						color: '#5d5d5d',
						anchorStyle: "center",
						visible: false
					}
				}).appendTo(cell);							

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.title.setText(data.title);
				cell.date.setText(data.date);
				cell.image.setSource(data.image);
				cell.friendsTitle.setText(data.friends.title);
				//cell.friends.setText(data.friends);
			}
		}).appendTo(view);
	},

	updateView: function () {
		var view = this;
		log("persist: ", this.persist);
		view.elements.elementGrid.changeDataset(fakeEvents, true);
		// Facebook.reset();
		// Facebook.api('me', function(result) {
		//    //Received a response from Facebook API.
		//    log('The result:', result);
		// });
	}
});