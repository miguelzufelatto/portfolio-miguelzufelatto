document.addEventListener('DOMContentLoaded', () => {
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
