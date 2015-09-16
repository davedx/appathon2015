/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
 /** 
 * @class MAF.element.SlideCarousel
 * @extends MAF.element.Container
 * * All cells are based on descendants of MAF.element.SlideCarouselCell
 * * cellCreator() is a required method that returns a cell with no data.
 * * cellUpdater() is a required method that will update a cell with data.
 * @example new MAF.element.SlideCarousel({
 *    visibleCells: 5,
 *    focusIndex: 3,
 *    orientation: 'horizontal',
 *    blockFocus: 'false',
 *    slideDuration: 0.3,
 *    cellCreator: function () {
 *       var cell = new MAF.element.SlideCarouselCell({
 *          events: {
 *             onSelect: function (event) {
 *                log('Selected', this.getDataItem());
 *             } 
 *          }
 *       });
 *
 *       cell.text = new MAF.element.Text({
 *          styles: {
 *             color: 'white'
 *          }
 *       }).appendTo(cell);
 *       return cell;
 *    },
 *    cellUpdater: function (cell, data) {
 *       cell.text.setText(data.label);
 *    }
 * }).appendTo(this);
 * @config {string} [title] The new job title.
 */
 /**
 * @cfg {Number} rows Number of cells visible for the viewer.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Number} indicates which position is always focused.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {String} orientation Horizontal or verticale orientation of the SlideCarousel.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Boolean} this determines whether the grid can be focus at all, this is handy when you decided to control your SlideCarousel with a different component.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Number} this determines how fast the cells will be moving to a new position.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {String} slideEase this determines with which easing cells will be moving to a new position.
 * @memberof MAF.element.SlideCarousel
 */

/**
 * Fired when the data set of the grid has changed.
 * @event MAF.element.SlideCarousel#onDatasetChanged
 */
/**
 * Fired when state of the grid is updated/changed.
 * @event MAF.element.SlideCarousel#onStateUpdated
 */
 /**
  * Fired when the slide navigation is complete.
  * @event MAF.element.SlideCarousel#onSlideDone
  */
define('MAF.element.SlideCarousel', function () {
	function hasFocus(cells) {
		for(var i = 0; i < cells.length; i++) {
			if (cells[i].element.hasFocus) {
				return true;
			}
		}
		return false;
	}
	function animateCells(cells, dir, parent) {
		if (cells) {
			cells.forEach(function (cell, i) {
				var cd = parent.currentDataset.length;
				if (cell) {
					if(!isEmpty(parent.currentDataset[i]) && parent.currentDataset.length !== i)
						cell.visible = true;
					else 
						cell.visible = false;
						
					cell.animate({
						hOffset: (parent.config.orientation === 'horizontal') ? parent.offsets[i] : 0,
						vOffset: (parent.config.orientation === 'vertical') ? parent.offsets[i] : 0,
						duration: parent.config.slideDuration,
						timingFunction:  parent.config.slideEase,
						events:{
							onAnimationEnded: function (slideAnimator) {
								slideAnimator.reset();
								if (i === cd -1) {
									parent.animating = false;
									parent.fire('onSlideDone');
								}
								cell.element.allowNavigation = false;
								cell.thaw();

								if (i === parent.config.focusIndex) {
									cell.element.allowNavigation = (parent.config.blockFocus) ? false : true;
									if (!parent.config.blockFocus && hasFocus(cells)) {
										cell.focus();
									}
								}
							}
						}
					});
				}
			}, this);
		}
	}
	function isEmpty(obj) {
		for(var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	}
	return new MAF.Class({
		ClassName: 'SlideCarousel',
		Extends: MAF.element.Container,
		Protected: {
			dispatchEvents: function (event, payload) {
				this.parent(event, payload);
				if (event.type === 'navigate') {
					if (event.defaultPrevented) {
						return;
					}
					var direction = event.detail.direction;
					if (this.config.blockFocus) {
						event.preventDefault();
					}
					if ((this.config.orientation === 'horizontal' && (direction === 'left' || direction === 'right')) || 
						(this.config.orientation === 'vertical' && (direction === 'up' || direction === 'down'))) {
						event.preventDefault();
					} else {
						this.fire('onNavigateOutOfBounds', event.detail);
						return;
					}
					var back = (direction === 'left' || direction === 'up'),
						next = (direction === 'right' || direction === 'down'),
						backLimit = (this.config.focusIndex - 1 <= this.config.dynamicFocusStart),
						nextLimit = (this.config.focusIndex + 1 >= this.cells.length - this.config.dynamicFocusEnd - ((this.cells.length - 2 < this.config.visibleCells) ? 0 : 1));
					if (this.config.dynamicFocus && ((back && !backLimit) || (next && !nextLimit))) {
						if (next)
							this.config.focusIndex++;
						else if (back)
							this.config.focusIndex--;
						this.cells[this.config.focusIndex].focus();
					} else {
						this.shift(direction);
					}
				}
			},
			handleFocusEvent: function (event) {
				var payload = event.payload;
				switch (event.type) {
					case 'onFocus':
						var currentCell = this.getCurrentCell();
						if (currentCell) currentCell.focus();
						break;
				}
			},
			setCellConfiguration: function (pos, cd) {
				var cell,
					dims = {
					width: (this.config.orientation === 'horizontal') ? ((1 / this.config.visibleCells) * 100) + '%' : '100%',
					height: (this.config.orientation === 'vertical') ? ((1 / this.config.visibleCells) * 100) + '%' :'100%',
					hOffset: (this.config.orientation === 'horizontal') ? (cd.width * -1) + (pos * cd.width) : 0,
					vOffset: (this.config.orientation === 'vertical') ? (cd.height * -1) + (pos * cd.height) : 0,
					transform: 'translateZ(0)',
					visible: (!isEmpty(this.currentDataset[pos])||this.currentDataset.length === 1)? true: false
				};
				cell = this.config.cellCreator.call(this).setStyles(dims);
				cell.grid = this;
				cell.appendTo(this);
				cell.element.allowNavigation = (this.config.blockFocus) ? false : (pos === this.config.focusIndex) ? true : false;
				this.cells.push(cell);
			},
			generateCells: function (data) {
				if (this.currentDataset.length > 0) {
					var cd = this.getCellDimensions();
					this.offsets = [];
					if (this.currentDataset.length === 1) {
						this.setCellConfiguration(this.config.focusIndex, cd);
					} else {
						var i = 0;
						for(i = 0; i < this.currentDataset.length; i++) {
							this.offsets.push((this.config.orientation === 'horizontal') ? (cd.width * -1) + (i * cd.width) : (cd.height * -1) + (i * cd.height));
							this.setCellConfiguration(i, cd);
						}
					}
				}
				return this.cells.length;
			},
			collectedPage: function (event) {
				var slider = this.retrieve('slider'),
					cell;
				switch(slider.status) {
					case 'reset':
					case 'empty':
						this.store('slider', {status: 'building'});
						this.updateCells();
						break;
					case 'focusCell':
						var index = slider.page;
						this.store('slider', {status: 'building'});
						this.updateCells(index);
						break;
					case 'navigating':
						switch(slider.direction) {
							case 'up':
							case 'left':
								cell = this.cells.pop();
								cell.freeze();
								this.cells.unshift(cell);
								this.currentDataset.unshift(this.currentDataset.pop());
								this.currentDataset[0] = event.payload.data.items[0];
								this.config.cellUpdater.call(this, this.cells[0], this.currentDataset[0]);
								break;
							case 'down':
							case 'right':
								cell = this.cells.shift();
								cell.freeze();
								this.cells.push(cell);
								this.currentDataset.shift();
								this.currentDataset.push(event.payload.data.items[0]);
								this.config.cellUpdater.call(this, this.cells[this.cells.length-1], this.currentDataset[this.currentDataset.length-1]);
								break;
						}
						this.store('slider', {status: 'idle'});
						this.fire('onStateUpdated');
						animateCells(this.cells, slider.direction, this);
						break;
				}
			},
			updateCells: function (page) {
				var cellUpdater = this.config.cellUpdater,
					dataLength = this.pager.getDataSize();
				this.animating = false;
				this.currentDataset = [];
				this.collection = [];
				this.page = page || 0;
				if (dataLength > 0) {
					if (dataLength === 1) {
						this.currentDataset.push(this.pager.getPage(0).items[0]);
					} else {
						var cellsToFill = this.config.visibleCells + 2;
						if (dataLength + 1 + this.config.focusIndex < cellsToFill) {
							cellsToFill = dataLength + this.config.focusIndex;
						}
						for(var i = 0; i < cellsToFill; i++) {
							var dif = this.config.focusIndex - i,
								difABS = Math.abs(dif),
								index = null;
							if ((difABS > dataLength-1 || dif > 0) && this.customPager) {
								var tmp = (this.page > 0) ? this.page - dif : null;
								index = (tmp === null || tmp < 0) ? null : tmp;
							} else if (difABS > dataLength-1 && !this.customPager) {
								index = 0;
							} else if (dif > 0) {
								index = (this.page !== 0) ? this.page - difABS : dataLength - difABS;
								if (index < 0) {
									index = dataLength - Math.abs(index);
								}
							} else if (dif < 0) {
								index = this.page + difABS;
								if (index >= dataLength) {
									index = index - dataLength;
								}
							} else {
								index = (this.page === dataLength) ? 0 : this.page;
							}
							if(index === null){
								this.currentDataset.push({});
							}
							else{
								this.currentDataset.push((this.pager.getPage(index).items[0]));
							}
							this.collection.push(index);
						}
					}
				}
				if (this.cells.length && this.cells.length === this.currentDataset.length) {
					this.cells.forEach(function (cell, u) {
						if (!isEmpty(this.currentDataset[u])) {
							cellUpdater.call(this, cell, this.currentDataset[u]);
						} else{
							cell.freeze();
						}
					}, this);
				} else {
					this.freeze();
					while (this.cells.length) {
						this.cells.pop().suicide();
					}
					if (this.generateCells() > 0) {
						this.cells.forEach(function (cell, u) {
							if (!isEmpty(this.currentDataset[u])) {
								cellUpdater.call(this, cell, this.currentDataset[u]);
							}
							else{
								cell.freeze();
							}
						}, this);
					}
					this.thaw();
				}
				this.fire('onStateUpdated');
			}
		},
		config: {
			visibleCells: 1,
			focusIndex: 1,
			slideEase: 'ease',
			carousel: true,
			orientation: 'horizontal',
			blockFocus: false,
			render: true,
			focus: true,
			dynamicFocus: false,
			dynamicFocusStart: 0,
			dynamicFocusEnd: 0
		},
		initialize: function () {
			this.config.visibleCells = this.config.visibleCells || 1;
			this.config.focusIndex = this.config.focusIndex || 1;
			this.config.orientation = this.config.orientation || 'horizontal';
			this.config.slideEase = this.config.slideEase || 'ease';
			this.config.blockFocus = this.config.blockFocus || false;
			this.config.slideDuration = this.config.slideDuration || 0.1;
			this.customPager = (this.config.carousel && this.config.carousel === true) ? false : true;
			this.parent();
			this.cells = [];
			if (this.config.pager) {
				this.customPager = true;
				this.pager = this.config.pager;
				delete this.config.pager;
			}
			else{
				this.pager = new MAF.utility.Pager(1, this.config.visibleCells);
			}
			if (!this.config.carousel) {
				this.customPager = true;
			}
			this.currentDataset = [];
			this.offsets = [];
			this.animating = false;
			this.store('slider', {status: 'empty'});
			this.collectedPage.subscribeTo(this.pager, 'pageDone', this);
			this.handleFocusEvent.subscribeTo(this, ['onFocus', 'onBlur'], this);
			this.setStyle('transform', 'translateZ(0)');
		},

		setVisibleCells: function (visibleCells) {
			this.config.visibleCells = visibleCells;
		},

		getVisibleCells: function () {
			return this.config.visibleCells;
		},

		setFocusIndex: function (index) {
			this.config.focusIndex = index;
		},

		getFocusIndex: function () {
			return (this.cells.length > 1) ? this.config.focusIndex : 0;
		},

		changeDataset: function (data, reset, dataLength) {
			data = data && data.length ? data : [];
			dataLength = (dataLength && (dataLength > data.length)) ? dataLength : data.length;
			this.pager.initItems(data, dataLength);
			this.store('slider', {status: 'reset'});
			this.collectPage(0);
			this.fire("onDatasetChanged");
		},

		collectPage: function (pagenum) {
			this.pager.getPage(pagenum);
		},

		getCellDataItem: function (c) {
			for(var i = 0; i < this.cells.length; i++) {
				if (c === this.cells[i]) {
					return this.currentDataset[i];
				}
			}
		},

		/**
		 * @method MAF.element.SlideCarousel#getCurrentPage
		 * @return The zero-based index of the current page of data.
		 */
		getCurrentPage: function () {
			return (this.collection && this.collection[this.config.focusIndex]) ? this.collection[this.config.focusIndex] : 0;
		},

		/**
		 * @method MAF.element.SlideCarousel#getPageCount
		 * @return this.mainCollection.length. The number of items in the dataset.
		 */
		getPageCount: function () {
			return this.pager.getNumPages();
		},

		/**
		 * Method for focussing a specific cell or dataitem in your grid.
		 * @method MAF.element.SlideCarousel#focucCell
		 * @param {integer} / index which as to be focused and aligned with the proper focusIndex cell.
		 */
		focusCell: function (target) {
			if (target >= this.getPageCount()) {
				return;
			}
			this.store('slider', {status: 'focusCell', page: target});
			this.pager.getPage(target);
		},

		/**
		 * Attach a accessory component to this component so it can update on grid events.
		 * @method MAF.element.SlideCarousel#attachAccessory
		 * @param {Class} accessory The accessory component.
		 * @return This component.
		 */
		attachAccessory: function (accessory) {
			if (accessory && accessory.attachToSource) {
				accessory.attachToSource(this);
			}
			return this;
		},

		/**
		 * Attach multiple accessory components to this component.
		 * @method MAF.element.SlideCarousel#attachAccessories
		 * @param {Array} arguments Contains muliple accessory components.
		 * @return This component.
		 */
		attachAccessories: function () {
			Array.slice(arguments).forEach(this.attachAccessory, this);
			return this;
		},

		/**
		 * Method for animating your SlideCarousel with a different component.
		 * @method MAF.element.SlideCarousel#shift
		 * @param {String} the direction the carousel has to slide.
		 */
		shift: function (direction) {
			if (this.config.orientation === 'vertical' && (direction === 'right' || direction === 'left')) {
				return;
			}
			if (this.config.orientation === 'horizontal' && (direction === 'up' || direction === 'down')) {
				return;
			}
			if (direction && !this.animating && this.retrieve('slider').status !== 'navigating') {
				this.animating = true;
				if (this.cells.length === 1) {
					return;
				}
				if (this.cells.length > 1) {
					var dataLength = this.pager.getNumPages(),
						cell;
					switch(direction) {
						case 'up':
						case 'left':
							if (isEmpty(this.currentDataset[this.config.focusIndex-1])) {
								this.fire('onNavigateOutOfBounds', {direction:direction});
								this.animating = false;
								return;
							}
							this.collection.unshift(this.collection.pop());
							this.collection[0] = (this.collection[1] - 1 < 0 && !this.customPager) ? dataLength -1 : (this.collection[1] - 1 < 0) ? null : this.collection[1]-1;
							if (this.collection[0] === null) {
								cell = this.cells.pop();
								cell.freeze();
								this.cells.unshift(cell);
								this.currentDataset.unshift(this.currentDataset.pop());
								this.currentDataset[0] = {};
								animateCells(this.cells, direction, this);
							} else {
								this.store('slider', {status: 'navigating', direction: direction});
								this.pager.getPage(this.collection[0]);
							}
							break;
						case 'down':
						case 'right':
							if (isEmpty(this.currentDataset[this.config.focusIndex+1])) {
								this.fire('onNavigateOutOfBounds', {direction:direction});
								this.animating = false;
								return;
							}
							this.collection.push(this.collection.shift());
							if (this.collection[this.collection.length-2] === null) {
								this.collection[this.collection.length-1] = null;
							} else if (this.collection[this.collection.length-2] + 1 >= dataLength) {
								this.collection[this.collection.length-1] = (this.collection[this.collection.length-2] + 1 >= dataLength && !this.customPager) ? 0 : null;
							} else {
								this.collection[this.collection.length-1] = this.collection[this.collection.length-2] + 1;
							}
							if (this.collection[this.collection.length-1] === null) {
								cell = this.cells.shift();
								cell.freeze();
								this.cells.push(cell);
								this.currentDataset.shift();
								this.currentDataset.push({});
								animateCells(this.cells, direction, this);
							} else {
								this.store('slider', {status: 'navigating', direction: direction});
								this.pager.getPage(this.collection[this.collection.length-1]);
							}
							break;
					}
				}
			}
		},

		/**
		 * @method MAF.element.SlideCarousel#getCellDimensions
		 * @return {Object} With the width and height of the cells for the grid.
		 */
		getCellDimensions: function () {
			return {
				width: (this.config.orientation === 'horizontal') ? Math.floor(this.width / this.config.visibleCells) : this.width,
				height: (this.config.orientation === 'vertical') ? Math.floor(this.height / this.config.visibleCells) : this.height
			};
		},

		/**
		 * @method MAF.element.SlideCarousel#getCellDataIndex
		 * @return {Object} returns the dataIndex
		 */
		getCellDataIndex: function (cell) {
			if (cell === this.getCurrentCell()) {
				return this.getCurrentPage();
			}
			else{
				return this.collection[this.cells.indexOf(cell)];
			}
		},

		getCurrentCell : function () {
			return this.cells[(this.cells.length === 1 ) ? 0 : this.config.focusIndex];
		},

		suicide: function () {
			if (this.pager) this.pager.suicide();
			delete this.currentDataset;
			delete this.offsets;
			delete this.pager;
			delete this.collection;
			if (this.cells) {
				while(this.cells.length) {
					this.cells.pop().suicide();
				}
				delete this.cells;
			}
			if (this.body) {
				this.body.suicide();
				delete this.body;
			}
			this.parent();
		}
	});
});