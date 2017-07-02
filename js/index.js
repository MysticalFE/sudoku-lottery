//es6的class语法糖，简化了js原有面对对象的写法
class Lottery {
	constructor () {
		this.count = 0; //位置总数
		this.speed = 10; //初始速度
		this.timer = 0; //定时器时间
		this.currentIndex = -1; //转动的当前位置
		this.rotateNum = 0; //转动次数
		this.basicCycle = 50; //运动初始次数
		this.prizePlace = -1; //中奖位置
		this.isClick = false; //是否重复点击抽奖
		this.parentDom = null; //根dom
		this.initOppo = 2; //初始抽奖次数
	}
	//初始化方法，点击抽奖事件
	init () {
		const _this = this;
		const initOppo = document.getElementById('resOpportunity');
		initOppo.innerHTML = '还有' + this.initOppo + '次机会'
		if ($('#lotteryBox').find('li').length > 0) {
			const $lottery = $('#lotteryBox');
			const $units = $lottery.find('li');
			this.count = $units.length;
			this.parentDom = $lottery;
		}
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
	}
	//为即将转到下一个节点添加class:active
	addNextItemClass () {
		this.parentDom.find('.lottery-unit-' + this.currentIndex).removeClass("active");
		this.currentIndex += 1;
		if (this.currentIndex >= this.count-1) {
			this.currentIndex = 0;
		}
		this.parentDom.find('.lottery-unit-' + this.currentIndex).addClass('active');
		return false
	}
	//浮层转动的逻辑都在该方法内实现
	turning () {
		this.rotateNum += 1
		this.addNextItemClass();
		//判断是否转动完毕
		if (this.rotateNum > this.basicCycle + 10 && this.prizePlace == this.currentIndex) {
			clearTimeout(this.timer)
			this.prizePlace = -1;
			this.timer = 0;
			this.initOppo != 0 ? this.isClick = false : this.isClick = true;
			let selectedEle = $(this.parentDom.find('.lottery-unit-' + this.currentIndex).selector)[0].dataset.value;
			console.log("恭喜你中了" + selectedEle + "等奖");
		} else {
			//该判断内是对转动速度speed的处理
			if (this.rotateNum < this.basicCycle) {
				this.speed -= 10
			} else if (this.rotateNum == this.basicCycle) {
				// 此处是随机数获取中奖位置的，在点击抽奖的时候该位置（随机数）就已确定
				this.prizePlace = Math.floor(Math.random() * this.count);
				this.prizePlace == 8 ? this.prizePlace = 0 : this.prizePlace = this.prizePlace;
				console.log(this.prizePlace)
			} else {
				// 如果中奖位置和当前位置的位差在一到多圈时，加快转动速度
				if (this.rotateNum > this.basicCycle + 10 && ((this.prizePlace == 0 && this.currentIndex == 7)) || this.prizePlace == this.currentIndex + 1) {
					this.speed += 100;
				} else {
					this.speed += 20;
				}
			}
			// 此处做匀速阶段的处理
			if (this.speed<40) {
	            this.speed=40;
	        };
	        // 定时器做整个转动处理
			this.timer = setTimeout(this.turning.bind(this),this.speed)//此处使用bind(),防止setTimeout改变this的指向
		}
		return false;
	} 
}
// 页面初始化，执行初始化方法
window.onload = () => {
    new Lottery().init();
}