var fakeMenuLabels = ["INFO", "LEAVE APPLICATION", "RELATED", "FILM & ANIMATION", "AUTOS & VEHICLES"];

var fakeVideos = [{
	title: "Kensington - Home Again",
	id: "d-XEiTf4LW8",
	image: "https://i.ytimg.com/vi/d-XEiTf4LW8/mqdefault.jpg",
	uploaded: "15 May 2015",
	description: "Official music video for single Home Again, released January 7th..."
},
{
	title: "Official Aftermovie | Dance Valley 2014",
	id: "8tTKX3NJ6wQ",
	image: "https://i.ytimg.com/vi/8tTKX3NJ6wQ/mqdefault.jpg",
	uploaded: "13 Sep 2014",
	description: "The Official Aftermovie for Dance Valley Festival 2014"
},
{
	title: "Oscar and The Wolf FREED FROM DESIRE",
	id: "SM9rozU1-VI",
	image: "https://i.ytimg.com/vi/SM9rozU1-VI/mqdefault.jpg",
	uploaded: "21 Sep 2014",
	description: ""
},
{
	title: "Lianne La Havas – Unstoppable",
	id: "S3fTw_D3l10",
	image: "https://i.ytimg.com/vi/YFic-xaLsPs/mqdefault.jpg",
	uploaded: "12 May 2015",
	description: "'Blood' is Out Now. Download from iTunes"
}
];

var videoImageRatio = 320/180;

var MainView = new MAF.Class({
	ClassName: 'MainView',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var view = this;
		for(var i=0; i<5; i++) {
			new MAF.element.Text({
				label: fakeMenuLabels[i],
				styles: {
					top: 40 + i*85,
					left: 40,
					fontSize: 30
				}
			}).appendTo(view);
		}
		new MAF.element.Text({
			label: "MUSIC",
			styles: {
				top: 30 + 5*85,
				left: 40,
				fontSize: 35
			}
		}).appendTo(view);

		var elementGrid = view.elements.elementGrid = new MAF.element.Grid({
			rows: 1,
			columns: 4,
			styles: {
				width: view.width,
				height: view.height / 2,
				hOffset: 40,
				vOffset: view.height / 2,
				backgroundColor: "black"
			},
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events:{
						onSelect: function () {
							MAF.application.loadView('view-transportOverlay', { id: this.ytid });
						},
						onFocus: function () {
							this.animate({backgroundColor: 'white',	duration: 0.3});
							this.title.animate({duration: 0.3, color: 'black'});
							this.uploaded.animate({duration: 0.3, color: '#880000'});
							this.description.animate({duration: 0.3, color: '#777'});
						},
						onBlur: function () {
							this.animate({backgroundColor: null, duration: 0.3});
							this.title.animate({duration: 0.3, color: 'white'});
							this.uploaded.animate({duration: 0.3, color: '#990000'});
							this.description.animate({duration: 0.3, color: 'white'});
						}
					}
				});

				cell.title = new MAF.element.Text({
					styles: {
						width: cell.width - 40,
						height: 80,
						color: 'white',
						fontSize: 30,
						hOffset: 20,
						vOffset: cell.height/2 + 20,
						wrap: true
					}
				}).appendTo(cell);

				cell.uploaded = new MAF.element.Text({
					styles: {
						width: cell.width,
						height: 50,
						color: '#880000',
						fontSize: 25,
						hOffset: 20,
						vOffset: cell.height/2 + 120,
						wrap: true
					}
				}).appendTo(cell);

				cell.description = new MAF.element.Text({
					styles: {
						width: cell.width - 40,
						height: 150,
						color: 'white',
						fontSize: 25,
						hOffset: 20,
						vOffset: cell.height/2 + 165,
						wrap: true
					}
				}).appendTo(cell);

				cell.image = new MAF.element.Image({
					styles: {
						width: cell.width,
						height: cell.width/videoImageRatio
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.ytid = data.id;
				cell.title.setText(data.title);
				cell.uploaded.setText(data.uploaded);
				cell.description.setText(data.description);
				cell.image.setSource(data.image);
			}
		}).appendTo(view);
	},

	updateView: function () {
		var view = this;
		view.elements.elementGrid.changeDataset(fakeVideos, true);
	}
});