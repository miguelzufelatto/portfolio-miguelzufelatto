// Canvas Network Animation
function initCanvasAnimation() {
    const canvas = document.getElementById('tech-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(134, 132, 105, 0.3)'; // Opacidade reduzida para sutileza
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Quantidade ajustada baseada na resolução da tela
        let numParticles = Math.floor((width * height) / 12000); 
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Desenhar linhas entre as partículas próximas
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    // A opacidade da linha diminui conforme a distância aumenta, com limite maximo de opacidade
                    let alpha = (1 - distance / 150) * 0.3;
                    ctx.strokeStyle = `rgba(134, 132, 105, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    initCanvasAnimation();
    
    // Interatividade do botão CTA no Hero para scrollar até os Projetos
    const ctaProjetos = document.getElementById('cta-projetos');
    
    if (ctaProjetos) {
        ctaProjetos.addEventListener('click', () => {
            const projetosSection = document.getElementById('projetos');
            if (projetosSection) {
                // Rolar a tela suavemente para a seção de projetos
                projetosSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
