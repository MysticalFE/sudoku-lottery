const lottery = {
	count: 0, //位置总数
	speed: 10, //初始速度
	timer: 0, //定时器时间
	currentIndex: -1, //转动的当前位置
	rotateNum: 0, //转动次数
	basicCycle: 50, //运动初始次数
	prizePlace: -1, //中奖位置
	isClick: false, //是否重复点击抽奖
	parentDom: null, //根dom
	initOppo: 2, //初始抽奖次数
	init () {
		const _this = this;
		const initOppo = document.getElementById('resOpportunity');
		initOppo.innerHTML = '还有' + this.initOppo + '次机会'
		if ($('#lotteryBox').find('li').length > 0) {
			$lottery = $('#lotteryBox');
			$units = $lottery.find('li');
			this.count = $units.length;
			this.parentDom = $lottery;
		}
		// if (this.initOppo > 0) {
			$('#lotteryBox .lotteryBtn').on('click',function () {
				if (_this.isClick) { //防止在转动过程中,重复点击抽奖按钮
					alert('你已用完抽奖次数')
					return false
				} else {
					_this.speed = 100;
					_this.rotateNum = 0;
					_this.initOppo -= 1;
					initOppo.innerHTML = '还有' + _this.initOppo + '次机会'
					_this.turning();
					_this.isClick = true; //一次完成后，可继续抽
					return false;
				}
			})
		// }
	},
	addNextItemClass () {
		this.parentDom.find('.lottery-unit-' + this.currentIndex).removeClass("active");
		this.currentIndex += 1;
		if (this.currentIndex >= this.count-1) {
			this.currentIndex = 0;
		}
		this.parentDom.find('.lottery-unit-' + this.currentIndex).addClass('active');
		return false
	},
	turning () {
		this.rotateNum += 1;
		// console.log(this)
		this.addNextItemClass();
		if (this.rotateNum > this.basicCycle + 10 && this.prizePlace == this.currentIndex) {
			clearTimeout(this.timer)
			this.prizePlace = -1;
			this.timer = 0;
			this.initOppo != 0 ? this.isClick = false : this.isClick = true;
			let selectedEle = $(this.parentDom.find('.lottery-unit-' + lottery.currentIndex).selector)[0].dataset.value;
			console.log("恭喜你中了" + selectedEle + "等奖");
		} else {
			if (this.rotateNum < this.basicCycle) {
				this.speed -= 10
			} else if (this.rotateNum == this.basicCycle) {
				this.prizePlace = Math.floor(Math.random() * this.count);
				this.prizePlace == 8 ? this.prizePlace = 0 : this.prizePlace = this.prizePlace;
				console.log(this.prizePlace)
			} else {
				if (this.rotateNum > this.basicCycle + 10 && ((this.prizePlace == 0 && this.currentIndex == 7)) || this.prizePlace == this.currentIndex + 1) {
					this.speed += 100;
				} else {
					this.speed += 20;
				}
			}
			if (lottery.speed<40) {
	            lottery.speed=40;
	        };
			this.timer = setTimeout(this.turning.bind(this),this.speed)//此处使用bind(),防止setTimeout改变this的指向
		}
		return false;
	}
}
window.onload = () => {
    lottery.init();
}