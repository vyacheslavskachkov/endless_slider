'use strict';

const SLIDE_WIDTH = 400,
    SLIDE_HEIGHT = 200,
    TOTAL_SLIDES = 5,
    VISIBLE_SLIDES = 1,
    SHIFT = 1;

let getIndexes = defineIndexes();

document.addEventListener('DOMContentLoaded', () => {
    let viewport = document.querySelector('.slider-viewport'),
        slider = document.querySelector('.slider');
    viewport.style.width = `${SLIDE_WIDTH * VISIBLE_SLIDES}px`;
    viewport.style.height = `${SLIDE_HEIGHT}px`;
    slider.style.right = `${SLIDE_WIDTH * (SHIFT + VISIBLE_SLIDES)}px`;
    for (let i = 0; i < 2 * SHIFT + VISIBLE_SLIDES; i++) {
        let slide = document.createElement('div');
        slide.className = 'slide';
        i < SHIFT
            ? slide.insertAdjacentText('beforeend', TOTAL_SLIDES - SHIFT + i)
            : slide.insertAdjacentText('beforeend', i - SHIFT)
        slide.style.transform = `translateX(${SLIDE_WIDTH * i}px)`;
        slider.append(slide);
    }
});

document.getElementById('next').addEventListener('click', e => {
    let slider = document.querySelector('.slider'),
        position = ~slider.style.transform.match(/-?(\d+\.?\d+)/g) + 1;
    for (let i = 0; i < SHIFT; i++) {
        let slide = document.createElement('div');
        slide.className = 'slide';
        slide.insertAdjacentText('beforeend', getIndexes(e.target.id));
        slide.style.transform = `translateX(${position + SLIDE_WIDTH * (2 * SHIFT + VISIBLE_SLIDES + i)}px)`;
        slider.append(slide);
    }
    if (!slider.classList.contains('smooth-shift'))
        slider.classList.add('smooth-shift');
    slider.style.transform = `translateX(-${position += SLIDE_WIDTH * SHIFT}px)`;
    slider.ontransitionend = () => {
        let slides = document.querySelectorAll('.slide');
        for (let i = 0; i < slides.length - (2 * SHIFT + VISIBLE_SLIDES); i++)
            slides[i].remove();
        if (position >= SLIDE_WIDTH * TOTAL_SLIDES) {
            slides = document.querySelectorAll('.slide');
            slider.classList.remove('smooth-shift');
            slider.style.transform = `translateX(-${position %= SLIDE_WIDTH * TOTAL_SLIDES}px)`;
            for (let i = 0; i < slides.length; i++)
                slides[i].style.transform = `translateX(${position + SLIDE_WIDTH * i}px)`;
        }
    }
});

document.getElementById('prev').addEventListener('click', e => {
    let slider = document.querySelector('.slider'),
        position = ~slider.style.transform.match(/-?(\d+\.?\d+)/g) + 1;
    for (let i = 1; i <= SHIFT; i++) {
        let slide = document.createElement('div');
        slide.className = 'slide';
        slide.insertAdjacentText('beforeend', getIndexes(e.target.id));
        slide.style.transform = `translateX(${position - SLIDE_WIDTH * i}px)`;
        slider.prepend(slide);
    }
    if (!slider.classList.contains('smooth-shift'))
        slider.classList.add('smooth-shift');
    slider.style.transform = `translateX(${SLIDE_WIDTH * SHIFT - position}px)`;
    slider.ontransitionend = () => {
        let slides = document.querySelectorAll('.slide');
        for (let i = 2 * SHIFT + VISIBLE_SLIDES; i < slides.length; i++)
            slides[i].remove();
        if (position <= 0) {
            slides = document.querySelectorAll('.slide');
            slider.classList.remove('smooth-shift');
            slider.style.transform = `translateX(-${(position %= SLIDE_WIDTH * TOTAL_SLIDES) + SLIDE_WIDTH * (TOTAL_SLIDES - SHIFT)}px)`;
            for (let i = 0; i < slides.length; i++)
                slides[i].style.transform = `translateX(${position + SLIDE_WIDTH * (TOTAL_SLIDES - SHIFT + i)}px)`;
        }
    }
});

function defineIndexes() {
    let nextIndex = VISIBLE_SLIDES + SHIFT - 1,
        prevIndex = TOTAL_SLIDES - SHIFT;
    return senderName => {
        switch (senderName) {
            case 'next':
                if (nextIndex < TOTAL_SLIDES - 1)
                    nextIndex++;
                else nextIndex = 0;
                if (prevIndex < TOTAL_SLIDES - 1)
                    prevIndex++;
                else prevIndex = 0;
                return nextIndex;
            case 'prev':
                if (prevIndex > 0)
                    prevIndex--;
                else prevIndex = TOTAL_SLIDES - 1;
                if (nextIndex > 0)
                    nextIndex--;
                else nextIndex = TOTAL_SLIDES - 1;
                return prevIndex;
        }
    }
}