var HorizontalGridView = new MAF.Class({
	ClassName: 'HorizontalGridView',

	Extends: MAF.system.SidebarView,

	createView: function () {
		var view = this;

		var backButton = new MAF.control.BackButton({
			label: $_('BACK')
		}).appendTo(view);

		// Create a PageIndicator
		var pageindicator = new MAF.control.PageIndicator({
			styles: {
				height: 50,
				width: view.width,
				vAlign: 'bottom'
			}
		}).appendTo(view);

		var horizontalGrid = view.elements.horizontalGrid = new MAF.element.Grid({
			rows: 1,
			columns: 2,
			carousel: true,
			styles: {
				width: view.width,
				height: view.height - backButton.outerHeight - pageindicator.height,
				vOffset: backButton.outerHeight
			},
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events:{
						onSelect: function () {
							log('onSelect GridCell', this.getCellIndex());
						},
						onFocus: function () {
							this.animate({
								backgroundColor: '#8101b1',
								duration: 0.3,
								scale: 1.2
							});
						},
						onBlur: function () {
							this.animate({
								backgroundColor: null,
								duration: 0.3,
								scale: 1.0
							});
						}
					}
				});

				cell.title = new MAF.element.Text({
					styles: {
						width: cell.width,
						height: cell.height,
						color: 'white',
						fontSize: 30,
						anchorStyle: 'center',
						wrap: true
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.title.setText(data.title);
			}
		}).appendTo(view);

		pageindicator.attachToSource(horizontalGrid);
	},

	updateView: function () {
		var view = this;
		view.elements.horizontalGrid.changeDataset([
			{ title: $_('Cell1') },
			{ title: $_('Cell2') },
			{ title: $_('Cell3') },
			{ title: $_('Cell4') },
			{ title: $_('Cell5') },
			{ title: $_('Cell6') }
		], true);
	}
});
