import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PixelBlast from "./PixelBlast.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const prefereMenosMovimentoFundo =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ══════════════════════════════════════════════════════════════
  // MOVIMENTO — os três momentos que o ZUF.OS permite, via GSAP.
  // Easing sempre steps() ou linear: curva suave contradiz pixel art.
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          comMovimento: "(prefers-reduced-motion: no-preference)",
          semMovimento: "(prefers-reduced-motion: reduce)",
        },
        (contexto) => {
          const { comMovimento } = contexto.conditions;

          const crt = document.getElementById("crt");
          const linhas = gsap.utils.toArray(".crt__linha");
          // o texto vive num span próprio para não destruir o cursor ao escrever
          const alvosTexto = linhas.map((el) => el.querySelector(".crt__texto"));
          const textos = linhas.map((el) => el.dataset.linha ?? "");
          const cursor = document.querySelector(".cursor");
          const janelas = gsap.utils.toArray(".abre-janela");

          // ── Sem movimento: tudo já nasce no estado final ──
          if (!comMovimento) {
            alvosTexto.forEach((el, i) => {
              if (el) el.textContent = textos[i];
            });
            if (cursor) cursor.hidden = false;
            gsap.set(janelas, { opacity: 1, scale: 1 });
            return;
          }

          // ── 1. BOOT DO CRT — a única cena orquestrada ──
          const boot = gsap.timeline();

          // power-on do monitor: a imagem abre a partir de uma linha,
          // como tubo de raios catódicos ganhando corrente
          boot
            .from(crt, {
              scaleY: 0.04,
              duration: 0.2,
              ease: "steps(4)",
              transformOrigin: "center center",
            })
            .from(
              crt,
              { opacity: 0.25, duration: 0.12, ease: "steps(2)" },
              "<"
            );

          // digitação: ~35ms por caractere, 180ms entre linhas
          alvosTexto.forEach((el, i) => {
            if (!el) return;
            const texto = textos[i];
            const conta = { chars: 0 };
            boot.to(
              conta,
              {
                chars: texto.length,
                duration: texto.length * 0.035,
                ease: "none",
                onUpdate: () => {
                  el.textContent = texto.slice(0, Math.round(conta.chars));
                },
              },
              i === 0 ? ">" : ">+=0.18"
            );
          });

          boot.call(() => {
            if (cursor) cursor.hidden = false;
          });

          // pular o boot: ninguém deve esperar o teatro duas vezes
          const pular = () => {
            boot.progress(1);
            removerOuvintes();
          };
          const removerOuvintes = () => {
            window.removeEventListener("click", pular);
            window.removeEventListener("keydown", pular);
            window.removeEventListener("scroll", pular);
          };
          window.addEventListener("click", pular);
          window.addEventListener("keydown", pular);
          window.addEventListener("scroll", pular, { passive: true });
          boot.eventCallback("onComplete", removerOuvintes);

          // ── 2. ABERTURA DE JANELA ao entrar na viewport ──
          // 0.96 → 1 em 140ms com steps(4): movimento serrilhado, como o resto
          janelas.forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, scale: 0.96 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.14,
                ease: "steps(4)",
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              }
            );
          });

          // ── 3. PISCAR — ambiente, não evento ──
          if (cursor) {
            gsap.to(cursor, {
              opacity: 0,
              duration: 0.53,
              ease: "steps(1)",
              repeat: -1,
              yoyo: true,
            });
          }

          // olhos do gato: piscada curta a cada ~6s
          gsap.to(".olho", {
            opacity: 0,
            duration: 0.08,
            ease: "steps(1)",
            repeat: -1,
            repeatDelay: 6,
            yoyo: true,
          });

          // ── 4. VARREDURA DO CRT — banda de fósforo descendo pela tela ──
          // Ambiente puro: é o refresh do tubo, não um evento de interface.
          // Percorre a altura real do CRT (yPercent seria relativo à própria
          // banda, que tem só 14px, e a varredura pararia no meio da tela).
          const varredura = document.querySelector(".crt__varredura");
          if (varredura && crt) {
            gsap.fromTo(
              varredura,
              { y: () => -varredura.offsetHeight },
              {
                y: () => crt.offsetHeight,
                duration: 5.5,
                ease: "none",
                repeat: -1,
                repeatDelay: 3.5,
                repeatRefresh: true,
              }
            );
          }

          // ── 5. LANÇAR ÍCONE — o duplo-flash de seleção do Windows ──
          const icones = gsap.utils.toArray(".icone");
          const selecionado = { backgroundColor: "#C08BF5", color: "#0C0813" };
          const solto = { backgroundColor: "rgba(0,0,0,0)", color: "#EDE7F5" };
          const aoAbrirIcone = (e) => {
            const rotulo = e.currentTarget.querySelector(".icone__rot");
            if (!rotulo) return;
            // duplo-flash discreto: liga, desliga, liga, solta
            gsap
              .timeline()
              .set(rotulo, selecionado)
              .set(rotulo, solto, 0.08)
              .set(rotulo, selecionado, 0.16)
              .set(rotulo, { clearProps: "backgroundColor,color" }, 0.24);
          };
          icones.forEach((el) => el.addEventListener("click", aoAbrirIcone));

          // ── 6. JANELA EM FOCO — sobe 2px, instantâneo (sem transição,
          //    como o Win98 fazia). A sombra maior vem do CSS. ──
          const cards = gsap.utils.toArray(".janela--projeto");
          const aoEntrar = (e) => gsap.set(e.currentTarget, { x: -2, y: -2 });
          const aoSair = (e) => gsap.set(e.currentTarget, { x: 0, y: 0 });
          cards.forEach((el) => {
            el.addEventListener("pointerenter", aoEntrar);
            el.addEventListener("pointerleave", aoSair);
          });

          // ── 7. JANELA QUE NÃO FECHA — tremor seco ao clicar no × ──
          // Feedback de sistema operacional, no lugar de um botão decorativo.
          const fechares = gsap.utils.toArray(
            '.btn-barra[aria-label="Fechar"]'
          );
          const aoTentarFechar = (e) => {
            const janela = e.currentTarget.closest(".janela");
            if (!janela) return;
            // base respeita o deslocamento de foco, se a janela estiver sob o cursor
            const base = janela.matches(":hover") ? -2 : 0;
            gsap
              .timeline()
              .set(janela, { x: base - 4 })
              .set(janela, { x: base + 4 }, 0.05)
              .set(janela, { x: base - 3 }, 0.1)
              .set(janela, { x: base + 3 }, 0.15)
              .set(janela, { x: base }, 0.2);
          };
          fechares.forEach((el) =>
            el.addEventListener("click", aoTentarFechar)
          );

          return () => {
            removerOuvintes();
            icones.forEach((el) =>
              el.removeEventListener("click", aoAbrirIcone)
            );
            cards.forEach((el) => {
              el.removeEventListener("pointerenter", aoEntrar);
              el.removeEventListener("pointerleave", aoSair);
            });
            fechares.forEach((el) =>
              el.removeEventListener("click", aoTentarFechar)
            );
          };
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // ── Relógio da barra de tarefas — dois-pontos pisca a cada segundo,
  //    como relógio digital de verdade ──
  useEffect(() => {
    const horaEl = document.getElementById("relogio-hora");
    const minEl = document.getElementById("relogio-min");
    const sepEl = document.getElementById("relogio-sep");
    if (!horaEl || !minEl || !sepEl) return;

    const semMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const tick = () => {
      const d = new Date();
      horaEl.textContent = String(d.getHours()).padStart(2, "0");
      minEl.textContent = String(d.getMinutes()).padStart(2, "0");
      if (!semMovimento) sepEl.style.opacity = d.getSeconds() % 2 ? "0.25" : "1";
    };
    tick();
    const intervalo = setInterval(tick, semMovimento ? 15000 : 1000);
    return () => clearInterval(intervalo);
  }, []);

  // ── Cards de projeto: descrição e tags com altura igual, para que o botão
  //    e todo o espaçamento interno fiquem idênticos em todos os cards ──
  useEffect(() => {
    const cartoes = Array.from(document.querySelectorAll(".janela--projeto"));
    if (!cartoes.length) return;

    const igualarBloco = (seletor) => {
      const blocos = cartoes
        .map((card) => card.querySelector(seletor))
        .filter(Boolean);
      if (!blocos.length) return;
      blocos.forEach((el) => {
        el.style.minHeight = "";
      });
      const maior = Math.max(...blocos.map((el) => el.offsetHeight));
      blocos.forEach((el) => {
        el.style.minHeight = `${maior}px`;
      });
    };

    const igualarAlturas = () => {
      igualarBloco(".projeto__desc");
      igualarBloco(".projeto__tags");
    };

    igualarAlturas();

    let t;
    const aoRedimensionar = () => {
      clearTimeout(t);
      t = setTimeout(igualarAlturas, 100);
    };
    window.addEventListener("resize", aoRedimensionar);
    document.fonts?.ready?.then(igualarAlturas);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, []);

  return (
    <>
      {!prefereMenosMovimentoFundo && (
        <PixelBlast
          variant="square"
          color="#C08BF5"
          pixelSize={4}
          patternScale={2.6}
          patternDensity={0.9}
          speed={0.35}
          edgeFade={0.4}
          enableRipples
          rippleThickness={0.1}
          rippleIntensityScale={1}
          style={{ opacity: 0.4 }}
        />
      )}

      {/* ═══════════ DOCK DE ÍCONES (nav desktop) ═══════════ */}
      <nav className="dock" aria-label="Navegação principal">
        <a className="icone" href="#sobre">
          <svg
            className="pixel"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <rect x={1} y={3} width={6} height={1} fill="#8CE87C" />
            <rect x={1} y={4} width={14} height={9} fill="#C08BF5" />
            <rect x={1} y={4} width={14} height={1} fill="#EFE6FA" />
            <rect x={1} y={12} width={14} height={1} fill="#6E5C87" />
          </svg>
          <span className="icone__rot">Sobre</span>
        </a>
        <a className="icone" href="#habilidades">
          <svg
            className="pixel"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <rect x={5} y={2} width={6} height={1} fill="#EFE6FA" />
            <rect x={4} y={3} width={8} height={6} fill="#C08BF5" />
            <rect x={3} y={4} width={10} height={4} fill="#C08BF5" />
            <rect x={5} y={4} width={2} height={2} fill="#EFE6FA" />
            <rect x={6} y={9} width={4} height={1} fill="#6E5C87" />
            <rect x={4} y={10} width={8} height={2} fill="#B9A5D3" />
          </svg>
          <span className="icone__rot">Habilidades</span>
        </a>
        <a className="icone" href="#projetos">
          <svg
            className="pixel"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <rect x={4} y={1} width={8} height={11} fill="#EDE7F5" />
            <rect x={3} y={3} width={10} height={9} fill="#EDE7F5" />
            <rect x={3} y={12} width={2} height={2} fill="#EDE7F5" />
            <rect x={7} y={12} width={2} height={2} fill="#EDE7F5" />
            <rect x={11} y={12} width={2} height={2} fill="#EDE7F5" />
            <rect x={5} y={5} width={2} height={2} fill="#160E24" />
            <rect x={9} y={5} width={2} height={2} fill="#160E24" />
          </svg>
          <span className="icone__rot">Projetos</span>
        </a>
        <a className="icone" href="#contato">
          <svg
            className="pixel"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <rect x={2} y={4} width={12} height={8} fill="#B9A5D3" />
            <rect x={2} y={4} width={12} height={1} fill="#EFE6FA" />
            <rect x={2} y={11} width={12} height={1} fill="#6E5C87" />
            <rect x={3} y={5} width={10} height={1} fill="#8CE87C" />
            <rect x={3} y={7} width={7} height={1} fill="#6E5C87" />
            <rect x={3} y={9} width={9} height={1} fill="#6E5C87" />
          </svg>
          <span className="icone__rot">Contato</span>
        </a>
      </nav>

      <div className="pagina">
        {/* ═══════════ HERO — MONITOR CRT LIGANDO ═══════════ */}
        <header
          className="hero"
          id="hero"
          style={{ paddingTop: 40, marginBottom: 64 }}
        >
          <h1 className="sr-only">Miguel Zufelatto — Engenheiro de Software</h1>

          <div className="janela" style={{ maxWidth: 680, margin: "0 auto" }}>
            <div className="janela__barra">
              <span className="t-barra janela__titulo">
                zuf.os — inicializando
              </span>
              <span className="janela__botoes">
                <button className="btn-barra" aria-label="Minimizar" tabIndex={-1}>
                  _
                </button>
                <button className="btn-barra" aria-label="Maximizar" tabIndex={-1}>
                  □
                </button>
                <button className="btn-barra" aria-label="Fechar" tabIndex={-1}>
                  ×
                </button>
              </span>
            </div>

            <div
              style={{
                padding: "16px 16px 8px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <svg
                className="pixel"
                width={72}
                height={63}
                viewBox="0 0 16 14"
                shapeRendering="crispEdges"
                aria-hidden="true"
              >
                <g fill="#0C0813">
                  <rect x={4} y={0} width={2} height={1} />
                  <rect x={10} y={0} width={2} height={1} />
                  <rect x={4} y={1} width={3} height={1} />
                  <rect x={9} y={1} width={3} height={1} />
                  <rect x={3} y={2} width={10} height={4} />
                  <rect x={4} y={6} width={8} height={2} />
                  <rect x={3} y={8} width={10} height={1} />
                  <rect x={2} y={9} width={12} height={4} />
                  <rect x={1} y={13} width={14} height={1} />
                  <rect x={14} y={9} width={1} height={3} />
                  <rect x={15} y={7} width={1} height={3} />
                </g>
                <rect className="olho" x={5} y={4} width={2} height={1} fill="#8CE87C" />
                <rect className="olho" x={9} y={4} width={2} height={1} fill="#8CE87C" />
              </svg>
            </div>

            <div className="crt" id="crt" aria-hidden="true">
              <span className="crt__varredura" />
              <p className="t-crt crt__linha" data-linha="carregando perfil...">
                <span className="crt__texto" />
              </p>
              <p className="t-crt crt__linha" data-linha="MIGUEL ZUFELATTO">
                <span className="crt__texto" />
              </p>
              <p className="t-crt crt__linha" data-linha="engenheiro de software">
                <span className="crt__texto" />
              </p>
              <p
                className="t-crt crt__linha"
                data-linha="analise de dados @ fiocruz"
              >
                <span className="crt__texto" />
              </p>
              <p
                className="t-crt crt__linha"
                data-linha="sistemas de computacao @ uff"
              >
                <span className="crt__texto" />
              </p>
              <p className="t-crt crt__linha" data-linha="pronto">
                <span className="crt__texto" />
                <span className="cursor" hidden />
              </p>
            </div>

            <div
              className="janela__corpo"
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <button
                id="cta-projetos"
                className="btn btn--primario"
                onClick={() =>
                  document
                    .getElementById("projetos")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver projetos
              </button>
              <a className="btn" href="#contato">
                Falar comigo
              </a>
            </div>
          </div>
        </header>

        <hr className="linha-h" />

        {/* ═══════════ SOBRE ═══════════ */}
        <section className="secao abre-janela" id="sobre">
          <p className="caminho">SOBRE.TXT</p>
          <h2 className="t-secao">Sobre</h2>
          <div className="janela" style={{ marginTop: 24 }}>
            <div className="janela__barra">
              <span className="t-barra janela__titulo">sobre.txt</span>
              <span className="janela__botoes">
                <button className="btn-barra" aria-label="Fechar" tabIndex={-1}>
                  ×
                </button>
              </span>
            </div>
            <div className="janela__corpo">
              <p className="t-corpo" style={{ maxWidth: "60ch" }}>
                Apaixonado por tecnologia desde que me entendo por gente. Hoje,
                estou na jornada de transformar essa paixão em carreira, sou
                estudante de Tecnologia em Sistemas de Computação na UFF e
                Analista de Dados na Fiocruz. Minha jornada é guiada pelo
                aprendizado contínuo e pelo desejo de dar orgulho à minha
                família através do meu trabalho. Sempre estou em busca do
                próximo desafio e de mais conhecimento seja no código ou na
                vida.
              </p>
            </div>
          </div>
        </section>

        <hr className="linha-h" />

        {/* ═══════════ HABILIDADES ═══════════ */}
        <section className="secao abre-janela" id="habilidades">
          <p className="caminho">SKILLS.SYS</p>
          <h2 className="t-secao">Habilidades</h2>
          <div className="janela" style={{ marginTop: 24 }}>
            <div className="janela__barra">
              <span className="t-barra janela__titulo">Verificação</span>
              <span className="janela__botoes">
                <button className="btn-barra" aria-label="Fechar" tabIndex={-1}>
                  ×
                </button>
              </span>
            </div>
            <div className="dialogo__conteudo">
              <svg
                className="pixel"
                width={32}
                height={32}
                viewBox="0 0 16 16"
                shapeRendering="crispEdges"
                style={{ flexShrink: 0 }}
                aria-hidden="true"
              >
                <rect x={2} y={8} width={2} height={2} fill="#8CE87C" />
                <rect x={4} y={10} width={2} height={2} fill="#8CE87C" />
                <rect x={6} y={8} width={2} height={2} fill="#8CE87C" />
                <rect x={8} y={6} width={2} height={2} fill="#8CE87C" />
                <rect x={10} y={4} width={2} height={2} fill="#8CE87C" />
                <rect x={12} y={2} width={2} height={2} fill="#8CE87C" />
              </svg>
              <p className="t-corpo" style={{ color: "var(--breu)" }}>
                Nenhum erro encontrado.
              </p>
            </div>
            <div className="janela__corpo" style={{ paddingTop: 0 }}>
              <span className="etiq">HTML</span>
              <span className="etiq">CSS</span>
              <span className="etiq">JavaScript</span>
              <span className="etiq">Python</span>
              <span className="etiq">Java</span>
              <span className="etiq">Git</span>
              <span className="etiq">SQL</span>
              <span className="etiq">Tailwind</span>
              <span className="etiq etiq--fosforo">Uso de IA para desenvolvimento</span>
            </div>
          </div>
        </section>

        <hr className="linha-h" />

        {/* ═══════════ PROJETOS ═══════════ */}
        <section className="secao" id="projetos">
          <p className="caminho">PROJETOS.DIR</p>
          <h2 className="t-secao">Projetos</h2>

          <div className="grade g2" style={{ marginTop: 24 }}>
            <div className="janela abre-janela janela--projeto">
              <div className="janela__barra">
                <span className="t-barra janela__titulo">zufs-caffe.exe</span>
                <span className="janela__botoes">
                  <button className="btn-barra" aria-label="Fechar" tabIndex={-1}>
                    ×
                  </button>
                </span>
              </div>
              <div className="janela__corpo janela__corpo--escuro">
                <p className="t-card">Zuf&apos;s Caffè</p>
                <p className="t-mini bruma projeto__desc" style={{ marginTop: 8 }}>
                  Uma landing page moderna e responsiva desenvolvida para
                  apresentar os produtos e a marca do Zuf&apos;s Caffè.
                </p>
                <div className="projeto__tags" style={{ marginTop: 12 }}>
                  <span className="etiq">Next.js</span>
                  <span className="etiq">TypeScript</span>
                  <span className="etiq">React</span>
                  <span className="etiq">CSS</span>
                </div>
                <a
                  className="btn btn--fantasma"
                  style={{ marginTop: 12 }}
                  href="https://zufscaffe.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir projeto ↗
                </a>
              </div>
            </div>

            <div className="janela abre-janela janela--projeto">
              <div className="janela__barra">
                <span className="t-barra janela__titulo">portfolio-v1.exe</span>
                <span className="janela__botoes">
                  <button className="btn-barra" aria-label="Fechar" tabIndex={-1}>
                    ×
                  </button>
                </span>
              </div>
              <div className="janela__corpo janela__corpo--escuro">
                <p className="t-card">Meu portfólio</p>
                <p className="t-mini bruma projeto__desc" style={{ marginTop: 8 }}>
                  Landing page com objetivo de mostrar meu trabalho e jornada
                  profissional.
                </p>
                <div className="projeto__tags" style={{ marginTop: 12 }}>
                  <span className="etiq">HTML</span>
                  <span className="etiq">CSS</span>
                  <span className="etiq">JavaScript</span>
                </div>
                <a
                  className="btn btn--fantasma"
                  style={{ marginTop: 12 }}
                  href="https://miguelzufelatto.github.io/portfolio-miguelzufelatto/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir projeto ↗
                </a>
              </div>
            </div>

            <div className="janela abre-janela janela--projeto">
              <div className="janela__barra">
                <span className="t-barra janela__titulo">b7burguer.exe</span>
                <span className="janela__botoes">
                  <button className="btn-barra" aria-label="Fechar" tabIndex={-1}>
                    ×
                  </button>
                </span>
              </div>
              <div className="janela__corpo janela__corpo--escuro">
                <p className="t-card">B7Burguer</p>
                <p className="t-mini bruma projeto__desc" style={{ marginTop: 8 }}>
                  Interface front-end para um delivery de hambúrgueres. Projeto
                  desenvolvido para aplicar conceitos de web design
                  responsivo.
                </p>
                <div className="projeto__tags" style={{ marginTop: 12 }}>
                  <span className="etiq">HTML</span>
                  <span className="etiq">CSS</span>
                </div>
                <a
                  className="btn btn--fantasma"
                  style={{ marginTop: 12 }}
                  href="https://miguelzufelatto.github.io/b7burguer/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir projeto ↗
                </a>
              </div>
            </div>

            <div className="janela abre-janela janela--projeto">
              <div className="janela__barra">
                <span className="t-barra janela__titulo">
                  starbucks-clone.exe
                </span>
                <span className="janela__botoes">
                  <button className="btn-barra" aria-label="Fechar" tabIndex={-1}>
                    ×
                  </button>
                </span>
              </div>
              <div className="janela__corpo janela__corpo--escuro">
                <p className="t-card">Starbucks Clone</p>
                <p className="t-mini bruma projeto__desc" style={{ marginTop: 8 }}>
                  Recriação responsiva da interface web da Starbucks. O foco do
                  projeto foi o domínio de estruturação de layouts modernos
                  aplicando conceitos de CSS Flexbox e Grid.
                </p>
                <div className="projeto__tags" style={{ marginTop: 12 }}>
                  <span className="etiq">HTML</span>
                  <span className="etiq">CSS</span>
                </div>
                <a
                  className="btn btn--fantasma"
                  style={{ marginTop: 12 }}
                  href="https://miguelzufelatto.github.io/starbucks/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir projeto ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr className="linha-h" />

        {/* ═══════════ CONTATO ═══════════ */}
        <section
          className="secao abre-janela"
          id="contato"
          style={{ marginBottom: 96 }}
        >
          <p className="caminho">CONTATO.EXE</p>
          <h2 className="t-secao">Vamos conversar</h2>
          <div className="janela" style={{ marginTop: 24, maxWidth: 520 }}>
            <div className="janela__barra">
              <span className="t-barra janela__titulo">Lembrete</span>
              <span className="janela__botoes">
                <button className="btn-barra" aria-label="Fechar" tabIndex={-1}>
                  ×
                </button>
              </span>
            </div>
            <div className="dialogo__conteudo">
              <svg
                className="pixel"
                width={32}
                height={32}
                viewBox="0 0 16 16"
                shapeRendering="crispEdges"
                style={{ flexShrink: 0 }}
                aria-hidden="true"
              >
                <rect x={3} y={1} width={10} height={14} fill="#EFE6FA" />
                <rect x={3} y={1} width={10} height={2} fill="#8CE87C" />
                <rect x={5} y={5} width={6} height={1} fill="#6E5C87" />
                <rect x={5} y={7} width={6} height={1} fill="#6E5C87" />
                <rect x={5} y={9} width={4} height={1} fill="#6E5C87" />
              </svg>
              <p className="t-corpo" style={{ color: "var(--breu)" }}>
                Escolha um canal e me chame.
              </p>
            </div>
            <div
              className="janela__corpo"
              style={{
                paddingTop: 0,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <a className="btn btn--primario" href="mailto:zufelatto@gmail.com">
                E-mail
              </a>
              <a
                className="btn"
                href="https://www.linkedin.com/in/miguelzuf/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
              <a
                className="btn"
                href="https://github.com/miguelzufelatto"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════ BARRA DE TAREFAS ═══════════ */}
      <nav className="tarefas" aria-label="Navegação rápida">
        <span className="tarefas__marca">ZUF.OS</span>
        <span className="tarefas__links">
          <a className="btn" style={{ padding: "6px 10px" }} href="#sobre">
            Sobre
          </a>
          <a className="btn" style={{ padding: "6px 10px" }} href="#habilidades">
            Skills
          </a>
          <a className="btn" style={{ padding: "6px 10px" }} href="#projetos">
            Projetos
          </a>
          <a className="btn" style={{ padding: "6px 10px" }} href="#contato">
            Contato
          </a>
        </span>
        <span className="tarefas__relogio" id="relogio">
          <span id="relogio-hora">--</span>
          <span id="relogio-sep">:</span>
          <span id="relogio-min">--</span>
        </span>
      </nav>
    </>
  );
}
