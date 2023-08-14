"use client";
const defaultUi = {
    Next: <div className="slider-default-ui-next" onClick={() => next()}>Next</div>,
    Prev: <div className="slider-default-ui-prev" onClick={() => prev()}>Prev</div>,
}
export function SliderObj(
    items=[],
    startItem=0,
    autoplay=true,
    autoplayInterval=5000,
    transitionDuration=2,
    transitionEasing="linear",
    autoplayDirection=1,
    onSlideChange=function( from, to ){},
    onStart=function(){},
    onComplete=function(){},
    ui=defaultUi,
    autoplayTick=100,
){
    this.ui = ui;
    this.startItem = startItem;
    this.autoplay = autoplay;
    this.autoplayDirection = autoplayDirection;
    this.autoplayInterval = autoplayInterval;
    this.transitionDuration=2;
    this.transitionEasing="linear";
    this.items = items;
    this.current = startItem || 0;
    this.from = startItem || 0;
    this.target = startItem || 0;
    this.autoplayCounter = 0;
    this.autoplayTick = autoplayTick;
    this.autoplayPause = autoplay ? false : true;
    this.autoplayCancel = false;
    this.position = this.current;
    this.speed = 0;
    this.sliding = false;
    this.slidingDirection = 1;
    this.started = false;
    this.animating = false;
    this.onSlideChange = onSlideChange;
    this.onStart = onStart;
    this.onComplete = onComplete;
    this.timeout = !this.timeout ? null : this.timeout;
};


SliderObj.prototype.init = function ( {
    items=[],
    startItem=0,
    autoplay=true,
    autoplayInterval=5000,
    transitionDuration=2,
    transitionEasing="linear",
    autoplayDirection=1,
    onSlideChange=function( from, to ){},
    onStart=function(){},
    onComplete=function(){},
    ui=defaultUi,
    autoplayTick=100,
}) {
    this.ui = ui;
    this.startItem = startItem || 0;
    this.current = startItem || 0;
    this.from = startItem;
    this.autoplay = autoplay;
    this.autoplayDirection = autoplayDirection;
    this.autoplayInterval = autoplayInterval;
    this.transitionDuration=2;
    this.transitionEasing="linear";
    this.items = items;
    this.autoplayCounter = 0;
    this.autoplayTick = autoplayTick;
    this.autoplayPause = autoplay ? false : true;
    this.position = this.current;
    this.speed = 0;
    this.sliding = false;
    this.slidingDirection = 1;
    this.started = false;
    this.animating = false;
    this.onSlideChange = onSlideChange;
    this.onStart = onStart;
    this.onComplete = onComplete;
    this.timeout = !this.timeout ? null : this.timeout;

    if( this.autoplay ) {
        this.sliding = true;
        this.autoplayStart();
    }
};

SliderObj.prototype.Pause = function() {
    this.autoplayPause = true;
}

SliderObj.prototype.autoplayResume = function() {
    this.autoplayPause = false;
}

SliderObj.prototype.reset = function() {
    this.autoplayPause = false;
    this.sliding = false;
    this.autoplayCancel = false;
    this.started = false;
    clearInterval( this.timeout );
    this.autoplayStart();
}

SliderObj.prototype.autoplayStart = function() {
    this.autoplay = true;
    this.autoplayPause = false;
    this.autoplayCounter = Date.now();
    this.stated = true;

    this.timeout = setInterval( () => {
        if( !this.autoplayPause ) {
            this.autoplayCounter = this.sliding ? Date.now() : this.autoplayCounter;
            if( Date.now() - this.autoplayCounter  >= this.autoplayInterval ) {
                this.next();
                this.autoplayCounter = Date.now();
            }
        }
        if( this.autoplayCancel ) {
            clearInterval( this.timeout );
        }
    }, this.autoplayTick );
}

SliderObj.prototype.autoplayStop = function() {
    this.autoplay = false;
    this.autoplayPause = true;
}

SliderObj.prototype.prev = function() {
    this.target = (this.target - 1 + this.items.length) % this.items.length;
    this.autoplayResume();
}

SliderObj.prototype.next = function() {
    if( this.autoplayPause ) return;
    this.autoplayPause = true;
    this.target = this.current + 1;
    this.from = this.current;
    this.sliding = true;
    this.onStart( this.from, this.target );
}

SliderObj.prototype.slideTo = function( index ) {

    this.target = ( index - ( this.current % this.items.length ) ) + this.current;
    console.log( this.target )
    return;
    this.autoplayPause = true;
    this.sliding = true;
    this.onStart( this.target,  index - ( this.current % this.items.length ) );
}

SliderObj.prototype.updatePosition = function( position, fps, duration, distance ) {

    fps = fps || 60;
    duration = duration || this.transitionDuration*fps;
    distance = distance || window.innerWidth;
    const pixelsPerFrame = distance / ( duration * distance );

    if( this.sliding === true ) {
        if( this.slidingDirection === 1 && this.current >= this.target ) {
            this.current = this.target;
            this.reset();
            this.onSlideChange( this.from, this.target )
            return parseInt(position)
        }
        if( this.slidingDirection === -1 && this.current <= this.target ) {
            this.current = this.target;
            this.reset();
            this.onSlideChange( this.from, this.target )
            return parseInt(position)
        }
        // then we are sliding to the left, the x coordinate is decreasing
        if( this.current < this.target  ) {
            if( pixelsPerFrame-position >= this.target ) {
                this.current = this.target;
                position = position - pixelsPerFrame;
                this.onSlideChange( this.from % this.items.length, this.target % this.items.length )
                this.reset();
                return parseInt(position)
            }
            position = position - pixelsPerFrame;
            this.current = -position;
            return position
        }
    }
    return position;
}
