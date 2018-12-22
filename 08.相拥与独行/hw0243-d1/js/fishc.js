var App = {};
App.setup = function () {
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.xC = canvas.width / 2;
    this.yC = canvas.height / 2;

    document.getElementsByTagName('body')[0].appendChild(canvas);

    this.stepCount = 0;
    this.particles = [];
    this.popPerBirth = 20;
    this.maxPop = 1000;
    this.lifespan = 1200;

    this.birth();
};
App.birth = function () {
    for (var i = 0; i < this.popPerBirth; i++) {
        // Add new particle to main this.particles array
        var r = 100, angle = 0.05 * (-0.5 + Math.random()) + 6.28 * i / this.popPerBirth;
        var particle = {
            x: this.xC + r * Math.cos(angle),
            y: this.yC + r * Math.sin(angle),
            xSpeed: 0,
            ySpeed: 0,
            size: 5 + 15 * Math.random(),
            name: 'seed-' + this.stepCount + '-' + Math.floor(1000000 * Math.random()),
            age: 0
        };

        this.particles.push(particle);
    }
};
App.evolve = function () {
    this.stepCount++;
    // Sometimes launch new line
    if (this.stepCount % 50 == 0 && this.particles.length < this.maxPop) {
        this.birth();
    }
    App.move();
    App.draw();
};
App.kill = function (particleName) {
    var newArray = _.reject(this.particles, function (seed) {
        return (seed.name == particleName);
    });
    this.particles = _.cloneDeep(newArray);
};
App.move = function () {
    for (var i = 0; i < this.particles.length; i++) {
        // Get particle
        var p = this.particles[i];

        // Add spring force
        var scale = 0.001, M = 1, norm = 1.5, visc = 0.95;
        var x = scale * (p.x - this.xC),
            y = scale * (p.y - this.yC);
        var dist = Math.sqrt(x * x + y * y);
        var multi = M * Math.pow(dist, -5);
        var xAcc = 3 * x * y * multi,
            yAcc = (3 * y * y - dist * dist) * multi;
        var accNorm = Math.sqrt(xAcc * xAcc + yAcc * yAcc);
        p.xSpeed += norm * xAcc / accNorm;
        p.ySpeed += norm * yAcc / accNorm;
        p.xSpeed *= visc;
        p.ySpeed *= visc;
        p.x += 0.1 * p.xSpeed;
        p.y += 0.1 * p.ySpeed;

        // Get older
        p.age++;

        // Kill if out
        /*if (p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height) {
          this.kill(p.name);
        }*/

        // Kill if too old
        if (p.age > this.lifespan) this.kill(p.name);
    }
};
App.draw = function () {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    this.ctx.fill();
    this.ctx.closePath();

    if (!this.particles.length) return false;
    //var p0 = this.particles[0];
    //this.ctx.moveTo(p0.x, p0.y);
    for (var i = 0; i < this.particles.length; i++) {
        // Draw particle
        var p = this.particles[i];
        //this.ctx.lineTo(p.x, p.y);

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 3, 0, 6.28, false);
        this.ctx.fillStyle = 'hsla(50, 100%, 50%, 0.95)';
        this.ctx.fill();
        this.ctx.closePath();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    App.setup();
    App.draw();

    var frame = function () {
        App.evolve();
        requestAnimationFrame(frame);
    };
    frame();

    $(".myImg").mouseenter(function () {
        $("span").slideDown(1111);
    });

    $(".myImg").mouseout(function () {
        $("span").slideUp(1111);
    });
});


