var fakeEvents = [{
	title: "Kensington - Pinkpop",
	date: "Jun 14th, Landgraaf",
	image: "./images/kensington1.jpg",
	friends: {
		title: "4 Friends Are Going",
		friends: ["Dave", "Dave"]
	}
}, {
	title: "Kensington - Ancienne Belgique",
	date: "November 13th, Brussels",
	image: "./images/kensington2.png",
	friends: {
		title: "4 Friends Are Going",
		friends: ["Dave", "Dave"]
	}
}, {
	title: "Kensington - Ziggo Dome",
	date: "November 25th, Amsterdam",
	image: "./images/kensington3.png",
	friends: {
		title: "4 Friends Are Going",
		friends: ["Dave", "Dave"]
	}
}];

var ArtistEvents = new MAF.Class({
	ClassName: 'ArtistEventsView',

	Extends: MAF.system.FullscreenView,

	loadFriendsAttending: function(artist, friends) {
		var view = this;
		Facebook.api('/1543400192610987/attending', function(result) {
			var friendsAttending = [];
			for(var i=0; i<result.data.length; i++) {
				for(var j=0; j<friends.length; j++) {
					if(friends[j].id === result.data[i].id) {
						friendsAttending.push(friends[j]);
					}
				}
			}
			console.log("friendsAttending: ", friendsAttending);
			view.loadEvents(artist, friendsAttending);
		});
	},

	loadEvents: function(artist, friendsAttending) {
		var view = this;
		new Request({
			url: 'http://api.eventful.com/json/events/search?app_key=fzbH4mzf75pTXR9F&keywords='+artist+'&location=Netherlands',
			onSuccess: function (json) {
				console.log("res: ", json);
				var events = json.events.event.slice(0, 3);
				var id = json.events.event[0].id;
				for(var i=0; i<events.length; i++) {
					events[i].image = fakeEvents[i].image;
					events[i].friends = friendsAttending;
				}
				view.elements.elementGrid.changeDataset(events, true);
			},
			onFailure: function (error) {
				console.log('failure', error);
			},
			onError: function (error) {
				console.log('error', error);
			}
		}).send();
	},

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
				fontSize: 45,
				color: "#5d5d5d"
			}
		}).appendTo(view);

		var elementGrid = view.elements.elementGrid = new MAF.element.Grid({
			rows: 3,
			columns: 1,
			styles: {
				width: view.width - 910,
				height: view.height - 300,
				hOffset: 80,
				vOffset: 187
			},
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events:{
						onSelect: function () {
							view.form.show();
							view.firstName.focus();
							//view.elements.elementGrid.freeze();
							view.elements.overlay.show();
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
						width: cell.width - 450,
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
						width: cell.width - 450,
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
						width: cell.width - 450,
						height: 50,
						color: '#5d5d5d',
						fontSize: 20,
						hOffset: cell.height + 50,
						vOffset: 140,
						wrap: true
					}
				}).appendTo(cell);

				cell.friends = [];
				cell.friends[0] = new MAF.element.Image({
					styles: {
						hOffset: cell.height + 50,
						vOffset: 190,
						width: 50,
						height: 50
					}
				}).appendTo(cell);
				cell.friends[1] = new MAF.element.Image({
					styles: {
						hOffset: cell.height + 50 + 60,
						vOffset: 190,
						width: 50,
						height: 50
					}
				}).appendTo(cell);
				cell.friends[2] = new MAF.element.Image({
					styles: {
						hOffset: cell.height + 50 + 120,
						vOffset: 190,
						width: 50,
						height: 50
					}
				}).appendTo(cell);
				cell.friends[3] = new MAF.element.Image({
					styles: {
						hOffset: cell.height + 50 + 180,
						vOffset: 190,
						width: 50,
						height: 50
					}
				}).appendTo(cell);
				cell.friends[4] = new MAF.element.Image({
					styles: {
						hOffset: cell.height + 50 + 240,
						vOffset: 190,
						width: 50,
						height: 50
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
						width: buttonSize+10,
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
				cell.date.setText(data.start_time);
				cell.image.setSource(data.image);
				cell.friendsTitle.setText(data.friends.length + " Friends Are Going");
				for(var i=0; i<data.friends.length; i++) {
					if(i < 5) {
						cell.friends[i].setSource("http://graph.facebook.com/" + data.friends[i].id + "/picture?type=square");
					}
				}
			}
		}).appendTo(view);

		view.elements.overlay = new MAF.element.Container({
			styles: {
				width: view.width - 910,
				height: view.height - 300,
				hOffset: 80,
				vOffset: 187,
				backgroundColor: "rgba(0, 0, 0, 0.6)",
				visible: false
			}
		}).appendTo(view);

		new MAF.element.Text({
			label: "",
			styles: {
				top: 177,
				left: view.width - 790,
				width: 2,
				height: view.height - 280,
				backgroundColor: "#5d5d5d"
			}
		}).appendTo(view);

		var form = new MAF.element.Text({
			label: "",
			styles: {
				top: 187,
				left: view.width - 750,
				width: 570,
				height: view.height - 300,
				backgroundColor: "white",
				visible: false
			}
		}).appendTo(view);

		new MAF.element.Text({
			label: "TICKETS",
			styles: {
				top: 20,
				left: 0,
				width: form.width,
				height: 40,
				fontSize: 45,
				anchorStyle: 'center',
				color: "#5d5d5d"
			}
		}).appendTo(form);

		var formLeft = 40;

		new MAF.element.Text({
			label: "First Name",
			styles: {
				top: 150,
				left: formLeft,
				width: form.width - formLeft*2,
				height: 30,
				fontSize: 25,
				color: "#5d5d5d"
			}
		}).appendTo(form);

		this.firstName = new MAF.control.TextEntryButton({
			ClassName: 'YTFormButton',
			styles: {
				top: 190,
				left: formLeft,
				width: form.width - formLeft*2,
				height: 65,
				fontSize: 20,
				color: 'white'
			},
			textStyles: {
				paddingLeft: 15,
				paddingTop: 18,
				width: "inherit",
				height: "inherit"
			},
			events: {
				onNavigate: function(event){
					event.stop();
					switch(event.payload.direction){
						case "down":
							view.secondName.focus();
						break;
					}
				}
			}
		}).appendTo(form);

		new MAF.element.Text({
			label: "Second Name",
			styles: {
				top: 300,
				left: formLeft,
				width: form.width - formLeft*2,
				height: 30,
				fontSize: 25,
				color: "#5d5d5d"
			}
		}).appendTo(form);

		this.secondName = new MAF.control.TextEntryButton({
			ClassName: 'YTFormButton',
			styles: {
				top: 340,
				left: formLeft,
				width: form.width - formLeft*2,
				height: 65,
				fontSize: 20,
				color: 'white'
			},
			textStyles: {
				paddingLeft: 15,
				paddingTop: 18,
				width: "inherit",
				height: "inherit"
			}
		}).appendTo(form);

		new MAF.element.Text({
			label: "Bank Account",
			styles: {
				top: 450,
				left: formLeft,
				width: form.width - formLeft*2,
				height: 30,
				fontSize: 25,
				color: "#5d5d5d"
			}
		}).appendTo(form);

		this.bankAccount = new MAF.control.TextEntryButton({
			ClassName: 'YTFormButton',
			styles: {
				top: 490,
				left: formLeft,
				width: form.width - formLeft*2,
				height: 65,
				fontSize: 20,
				color: 'white'
			},
			textStyles: {
				paddingLeft: 15,
				paddingTop: 18,
				width: "inherit",
				height: "inherit"
			}
		}).appendTo(form);

		this.orderBtn = new MAF.control.TextButton({
			ClassName: 'YTOrderButton',
			label: "OK",
			styles: {
				top: 630,
				left: formLeft + 100,
				width: form.width - (100+formLeft)*2,
				height: 65,
				fontSize: 45
			},
			textStyles: {
				width: "inherit",
				height: "inherit",
				anchorStyle: "center",
			}
		}).appendTo(form);

		this.form = form;
	},

	updateView: function () {
		var view = this;
		log("persist: ", this.persist);
		var artist = this.persist.artist;

		Facebook.api('/me/friends', function(result) {
			log('The result:', result);

			var friends = result.data;
			view.loadFriendsAttending(artist, friends);
		});
	}
});