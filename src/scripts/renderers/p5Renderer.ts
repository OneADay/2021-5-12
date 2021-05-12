import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

function easeInQuint(x: number): number {
    return x * x * x;
  }
  
  function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
  }
  

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
    colors = ['#778DA9', '#1B263B', '#2C423F', '#E0E1DD'];
    backgroundColor = '#0D1B2A';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    x: number;
    y: number;

    frameCount = 0;
    totalFrames = 1000;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);
    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;

        s.noiseSeed(50);
        let bg = s.color(this.backgroundColor);
        s.background(bg);
    }

    protected draw(s) {

        if (this.animating) { 
            this.frameCount += 4;

            let frameDelta = 2 * Math.PI * (this.frameCount % this.totalFrames) / this.totalFrames;
        
            let bg = s.color(this.backgroundColor);
            s.background(bg);
        
            let xStart = 0;
            let yStart = 0;
            let w = xStart + this.width;
            let h = yStart + this.height;
        
            let yDistance = 10;
            let xDistance = 10;
        
            for (let y = yStart; y < h; y+= yDistance) {
              for (let x = xStart; x < w; x+= xDistance) {
                    let _x = x;
        
                    let noiseOffset = frameDelta;
                    let offsetY = s.noise(x * 0.01, -noiseOffset + y * 0.01) * 2.5;
                    offsetY = Math.pow(offsetY, 6);
                
                    let _y = y - Math.abs(Math.sin(frameDelta) * offsetY);
                
                    let size = Math.abs(Math.sin(frameDelta) * (offsetY / 10))
                    size = Math.max(size, 1);
                    
                    let pct = Math.abs(Math.sin(frameDelta) * (offsetY / 50));
                    let colorA = s.color(this.colors[0]);
                    let colorB = s.color(this.colors[3]);
                    let colorC = s.color(this.colors[2]);
                    pct = easeInQuint(pct);
                    let _color = s.lerpColor(colorA, colorB, pct);
        
                    //if (Math.abs(Math.sin(frameDelta)) < 0.5) {
                    let restPCT = Math.abs(Math.sin(frameDelta));
                    restPCT = easeOutQuart(restPCT);
                    _color = s.lerpColor(colorC, _color, restPCT);
                    //}
                
                    //noFill();
                    s.strokeWeight(1);
                    s.stroke(_color);
                    s.fill(_color);
        
                    s.circle(_x, _y, size);
               }
            }

            if (this.recording) {
                if (frameDelta == 0) {
                    this.completeCallback();
                }
            }
        }
    }

    protected getPolar = function(x, y, r, a) {
        // Get as radians
        var fa = a * (Math.PI / 180);
        
        // Convert coordinates
        var dx = r * Math.cos(fa);
        var dy = r * Math.sin(fa);
        
        // Add origin values (not necessary)
        var fx = x + dx;
        var fy = y + dy;
    
        return [fx, fy];
    }
    

    public render() {

    }

    public play() {
        this.frameCount = 0;
        this.recording = true;
        this.animating = true;
        let bg = this.s.color(this.backgroundColor);
        this.s.background(bg);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}