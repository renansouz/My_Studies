import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';

const App = () => {
function map(valueIn, minIn, maxIn, minOut, maxOut) {
    return ((valueIn - minIn) / (maxIn - minIn)) * (maxOut - minOut) + minOut;
}
 // Função que cria uma grade de letras em um elemento HTML
function createGrid(divGrid, qtdeLinhas, qtdeColunas, paramOpcoes) {
    // Define opções padrão e sobrescreve com as opções fornecidas, se houver
    const opcoes = {
        habilitarDiagonais: false,
        habilitarPalavrasInvertidas: false,
        habilitarPalavrasInvertidasEmDiagonais: false,
        ...paramOpcoes,
    };
     // Inicializa arrays para armazenar informações da grade de letras
    let listaPalavras = [];// Armazena as palavras a serem inseridas na grade

    let gridLetras = [];  // Armazena a configuração da grade com letras

    let colorWordBg = "rgba(256, 20, 20, 0.3)" // Atribui uma cor 

    let selecaoAtual = {
        indiceInicialX: undefined,
        indiceInicialY: undefined,
        posicaoInicialX: undefined,
        posicaoInicialY: undefined,
        cor: colorWordBg // Atribui uma cor 
    };
     // Função que gera uma letra aleatória 
    const gerarLetraAleatoria = () => {
        const indiceLetra = Math.floor(Math.random() * 26);
        return String.fromCharCode(65 + indiceLetra);
    };
     // Função que inicializa a grade de letras com letras aleatórias
    const inicializar = () => {
        for (let linha = 0; linha < qtdeLinhas; linha++) {
            gridLetras[linha] = [];
            for (let coluna = 0; coluna < qtdeColunas; coluna++) {
                // Cria um objeto para cada célula da grade com letra aleatória e estado "não fixo"
                gridLetras[linha][coluna] = {
                    letra: gerarLetraAleatoria(),
                    ehFixa: false,
                };
            }
        }
    };
      // Função que verifica se a orientação é válida de acordo com as opções
    const verificarOrientacaoValida = (orientacao) => {
         // Verifica as restrições de orientação baseadas nas opções fornecidas
        if (!opcoes.habilitarDiagonais && [1, 3, 5, 7].includes(orientacao)) {
            return false;
        }
        if (
            !opcoes.habilitarPalavrasInvertidas &&
            [0, 5, 6, 7].includes(orientacao)
        ) {
            return false;
        }
        if (
            !opcoes.habilitarPalavrasInvertidasEmDiagonais &&
            [5, 7].includes(orientacao)
        ) {
            return false;
        }

        return true;
    };
    // Função que verifica se uma posição (coordenadas) está dentro dos limites da grade
    const verificarSeCabeNoGrid = ({ xFinal, yFinal }) => {
        return (
            xFinal >= 0 && xFinal < qtdeColunas && yFinal >= 0 && yFinal < qtdeLinhas
        );
    };

      // Função que verifica se uma célula específica está disponível (não fixa ou contém a letra da palavra)
    const verificarSeCelulaEstaDisponivel = (iColuna, iLinha, letraPalavra) => {
        const celula = gridLetras[iLinha][iColuna];
        return !celula.ehFixa || celula.letra === letraPalavra;
    };
                // Função que verifica se todas as células necessárias para uma palavra estão disponíveis
    const verificarSeCelulasEstaoDisponiveis = (posicao) => {
        const { palavra, xInicial, yInicial, xFinal, yFinal } = posicao;
        let flagCelulasDisponiveis = true;
        for (let indice = 0; indice < palavra.length; indice++) {
            const xAtual = map(indice, 0, palavra.length - 1, xInicial, xFinal);
            const yAtual = map(indice, 0, palavra.length - 1, yInicial, yFinal);
            if (!verificarSeCelulaEstaDisponivel(xAtual, yAtual, palavra[indice])) {
                flagCelulasDisponiveis = false;
                return;
            }
        }
        return flagCelulasDisponiveis;
    };

    // Função que calcula a coordenada x final com base na orientação e largura da palavra
    const retornarXFinal = (xInicial, larguraPalavra, orientacao) => {
        switch (orientacao) {
            case 0: // Direção (relógio): 12h00
            case 4: // Direção (relógio): 06h00
                return xInicial;

            case 1: // Direção (relógio): 01h30
            case 2: // Direção (relógio): 03h00
            case 3: // Direção (relógio): 04h30
                return xInicial + larguraPalavra - 1;

            case 5: // Direção (relógio): 07h30
            case 6: // Direção (relógio): 09h00
            case 7: // Direção (relógio): 10h30
                return xInicial - larguraPalavra + 1;
        }
    };

     // Função que calcula a coordenada y final com base na orientação e largura da palavra
    const retornarYFinal = (yInicial, larguraPalavra, orientacao) => {
        switch (orientacao) {
            case 2: // Direção (relógio): 03h00
            case 6: // Direção (relógio): 09h00
                return yInicial;

            case 0: // Direção (relógio): 12h00
            case 1: // Direção (relógio): 01h30
            case 7: // Direção (relógio): 10h30
                return yInicial - larguraPalavra + 1;

            case 3: // Direção (relógio): 04h30
            case 4: // Direção (relógio): 06h00
            case 5: // Direção (relógio): 07h30
                return yInicial + larguraPalavra - 1;
        }
    };
        // Função que gera uma lista de posições possíveis para uma palavra na grade
    const listarPosicoesPossiveis = (palavra) => {
        let listaPosicoes = [];
          // Loop através de todas as orientações possíveis
        for (let orientacao = 0; orientacao < 8; orientacao++) {
            if (verificarOrientacaoValida(orientacao)) {
                for (let xInicial = 0; xInicial < qtdeColunas; xInicial++) {
                    for (let yInicial = 0; yInicial < qtdeLinhas; yInicial++) {
                     // Calcula as coordenadas x e y finais com base na orientação
                        const posicao = {
                            palavra,
                            xInicial,
                            yInicial,
                            xFinal: retornarXFinal(xInicial, palavra.length, orientacao),
                            yFinal: retornarYFinal(yInicial, palavra.length, orientacao),
                            palavraEstaCirculada: false,
                            cor: colorWordBg
                        };
                       // Verifica se a posição se encaixa no grid e se as células estão disponíveis
                        if (
                            verificarSeCabeNoGrid(posicao) &&
                            verificarSeCelulasEstaoDisponiveis(posicao)
                        ) {
                            listaPosicoes.push(posicao);
                        }
                    }
                }
            }
        }

        return listaPosicoes;
    };
    // Função que adiciona uma palavra na posição especificada
    const adicionarPalavraNaPosicao = (posicao) => {
        const { palavra, xInicial, yInicial, xFinal, yFinal } = posicao;
        for (let indice = 0; indice < palavra.length; indice++) {
            const xAtual = map(indice, 0, palavra.length - 1, xInicial, xFinal);
            const yAtual = map(indice, 0, palavra.length - 1, yInicial, yFinal);
               // Define as células da grade como fixas e preenche com as letras da palavra
            gridLetras[yAtual][xAtual] = {
                letra: palavra[indice],
                ehFixa: true,
            };
        }
           // Adiciona a posição à lista de palavras
        listaPalavras.push(posicao);
    };

    // Função que adiciona uma palavra ao caça-palavras
    const adicionarPalavra = (palavra) => {
      
         // Lista todas as posições possíveis para a palavra
        const listaPosicoes = listarPosicoesPossiveis(palavra.toUpperCase());

          // Escolhe aleatoriamente uma posição da lista e adiciona a palavra lá
        const indiceRandom = Math.floor(Math.random() * listaPosicoes.length);
        adicionarPalavraNaPosicao(listaPosicoes[indiceRandom]);
    };

      // Função que circula ou desmarca uma palavra no caça-palavras


     // Função que retorna a orientação baseada nas coordenadas x e y das posições inicial e final
    const retornarOrientacao = ({ xInicial, yInicial, xFinal, yFinal }) => {
          // Verifica as diferentes combinações de coordenadas para determinar a orientação
        if (xFinal === xInicial && yFinal < yInicial) return 0;
        if (xFinal > xInicial && yFinal < yInicial) return 1;
        if (xFinal > xInicial && yFinal === yInicial) return 2;
        if (xFinal > xInicial && yFinal > yInicial) return 3;
        if (xFinal === xInicial && yFinal > yInicial) return 4;
        if (xFinal < xInicial && yFinal > yInicial) return 5;
        if (xFinal < xInicial && yFinal === yInicial) return 6;
        if (xFinal < xInicial && yFinal < yInicial) return 7;
    };

    // Função que atualiza a exibição da grade no elemento HTML
    const atualizarGrid = () => {
        divGrid.innerHTML = "";
        gridLetras.forEach((linha, indiceY) => {
            const divLinha = document.createElement("div");
            divLinha.classList.add("grid-linha");
            linha.forEach((celula, indiceX) => {
                const divCelula = document.createElement("div");
                divCelula.classList.add("grid-celula");
                divCelula.setAttribute("data-indice-x", indiceX);
                divCelula.setAttribute("data-indice-y", indiceY);

                const divLetra = document.createElement("div");
                divLetra.classList.add("grid-letra");
                if (celula.ehFixa) divLetra.classList.add("grid-letra-fixa");
                divLetra.innerText = celula.letra;
                divCelula.appendChild(divLetra);
                divLinha.appendChild(divCelula);
            });
            divGrid.appendChild(divLinha);
        });
    };

     // Função que retorna as coordenadas da célula em relação ao elemento HTML
    const retornarCoordenadasCelula = (celulaX, celulaY) => {
          // Verifica se as coordenadas são válidas
        if (celulaX === undefined
            || celulaY === undefined
            || celulaX < 0
            || celulaX >= qtdeColunas
            || celulaY < 0
            || celulaY >= qtdeLinhas) {
            throw new Error(`Célula[${celulaX}][${celulaY}] não encontrada.`)
        }
        // Calcula as coordenadas da célula com base no elemento HTML
        const { left: gridLeft, top: gridTop } = divGrid.getBoundingClientRect();
        const indice = celulaY * qtdeColunas + celulaX;
        const celula = document.querySelectorAll(".grid-celula")[indice];
        if (!celula) {
            throw new Error(`Célula não encontrada.`)
        }
        let { left, top, width } = celula.getBoundingClientRect();
        return {
            left: parseInt(left - gridLeft + width / 2 + celulaX * 0.2 - 1),
            top: parseInt(top - gridTop + width / 2 + celulaY * 0.2 - 1)
        };
    };

     // Função para desenhar a seleção de uma palavra
    const desenharSelecao = (contexto, inicial, final, orientacao, cor) => {
        const rotacaoInicial = (orientacao * Math.PI) / 4.0;
        const rotacaoFinal = rotacaoInicial + Math.PI;
        const espessura = 8

        contexto.fillStyle = cor;
        contexto.lineWidth = 1;

        contexto.beginPath();
        if (inicial.left === final.left && inicial.top === final.top) {
            contexto.ellipse(inicial.left, inicial.top, espessura, espessura, 0, 0, 2 * Math.PI);
        }
        else {
            contexto.ellipse(inicial.left, inicial.top, espessura, espessura, rotacaoInicial, 0, Math.PI);
            contexto.ellipse(final.left, final.top, espessura, espessura, rotacaoFinal, 0, Math.PI);
        }
        contexto.fill();
    }

    // Função para selecionar uma palavra no caça-palavras
    const selecionarPalavra = (contexto, objPalavra, cor) => {
        const { xInicial, yInicial, xFinal, yFinal } = objPalavra;
        const inicial = retornarCoordenadasCelula(xInicial, yInicial);
        const final = retornarCoordenadasCelula(xFinal, yFinal);

        const orientacao = retornarOrientacao(objPalavra);

        desenharSelecao(contexto, inicial, final, orientacao, cor);
    };

     // Função para atualizar as palavras selecionadas no elemento canvas
    const atualizarPalavrasSelecionadas = () => {
        const canvas = document.createElement("canvas");
        canvas.classList.add("canvas-selecao-palavras");
        const rectGrid = divGrid.getBoundingClientRect();
        canvas.setAttribute("width", rectGrid.width);
        canvas.setAttribute("height", rectGrid.height);
        const ctx = canvas.getContext("2d");

         // Desenha a seleção para palavras circuladas
        listaPalavras.forEach((objPalavra) => {
            if (objPalavra.palavraEstaCirculada) {
                selecionarPalavra(ctx, objPalavra, objPalavra.cor);
            }
        });

        // Desenha a seleção para a palavra em andamento (seleçãoAtual)
        const {
            indiceInicialX: xInicial,
            indiceInicialY: yInicial,
            indiceFinalX: xFinal,
            indiceFinalY: yFinal,
            cor
        } = selecaoAtual

        if (xInicial !== undefined
            && yInicial !== undefined
            && xFinal !== undefined
            && yFinal !== undefined) {
            const posicaoPalavra = {
                xInicial,
                yInicial,
                xFinal,
                yFinal
            };
            selecionarPalavra(ctx, posicaoPalavra, cor);
        }
        else if (xFinal !== undefined
            && yFinal !== undefined) {
            const posicaoPalavra = {
                xInicial: xFinal,
                yInicial: yFinal,
                xFinal,
                yFinal
            };
            selecionarPalavra(ctx, posicaoPalavra, cor);
        }

        divGrid.appendChild(canvas);
    };

    // Função para atualizar a lista de palavras no elemento HTML
    const atualizarListaPalavras = () => {
        const ulListaPalavras = document.querySelector('.lista-palavras');
        ulListaPalavras.innerHTML = '';
        
        // Ordena e exibe as palavras na lista
        listaPalavras.sort().forEach(objPalavra => {
            const liPalavra = document.createElement('li');
            liPalavra.classList.add('item-palavra');
            if (objPalavra.palavraEstaCirculada) {
                liPalavra.classList.add('item-palavra-encontrada');
            }
            liPalavra.innerText = objPalavra.palavra;
            ulListaPalavras.appendChild(liPalavra);
        });


       
    };

   // Função para atualizar a exibição da grade, palavras selecionadas e lista de palavras
    const atualizarGridNoDOM = () => {
        atualizarGrid();
        atualizarPalavrasSelecionadas();
        atualizarListaPalavras();
    };

    // Função para retornar as coordenadas da célula mais próxima do mouse
    const retornarCoordenadasCelulaMaisProximaMouse = (
        mouseX,
        mouseY,
        inicioSelecao
    ) => {
        const divGrid = gridCaçaPalavras;
        rectGrid = divGrid.getBoundingClientRect();
        let coordMaisProxima = { indiceX: -1, indiceY: -1, distancia: 10000 };

        divGrid.querySelectorAll(".grid-celula").forEach((divCelula) => {
            const indiceX = parseInt(divCelula.getAttribute("data-indice-x"));
            const indiceY = parseInt(divCelula.getAttribute("data-indice-y"));
            const celula = retornarCoordenadasCelula(indiceX, indiceY);
            const { indiceInicialX: inicialX, indiceInicialY: inicialY } = selecaoAtual
            if (
                inicioSelecao ||
                inicialX === indiceX ||
                inicialY === indiceY ||
                Math.abs(inicialX - indiceX) === Math.abs(inicialY - indiceY)
            ) {
                const distX = Math.abs(celula.left - mouseX);
                const distY = Math.abs(celula.top - mouseY);
                const distancia = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
                if (distancia < coordMaisProxima.distancia) {
                    coordMaisProxima = { indiceX, indiceY, distancia };
                }
            }
        });

        return coordMaisProxima;
    };

    // Função para circular uma palavra durante a interação com o mouse
    const circularPalavraMouse = (mouseX, mouseY, isMouseDown) => {
        const coord = retornarCoordenadasCelulaMaisProximaMouse(mouseX, mouseY, inicioSelecao = !isMouseDown);
        selecaoAtual = {
            ...selecaoAtual,
            indiceFinalX: coord.indiceX,
            indiceFinalY: coord.indiceY
        }
    };

    // Função para iniciar a seleção de uma palavra com o mouse
    const iniciarSelecaoPalavraMouse = (mouseX, mouseY) => {
        const coord = retornarCoordenadasCelulaMaisProximaMouse(mouseX, mouseY, inicioSelecao = true);
        selecaoAtual = {
            ...selecaoAtual,
            indiceInicialX: coord.indiceX,
            indiceInicialY: coord.indiceY,
            posicaoInicialX: coord.celulaX,
            posicaoInicialY: coord.celulaY
        }
    };

    // Função para finalizar a seleção de uma palavra com o mouse
    const finalizarSelecaoPalavraMouse = (mouseX, mouseY) => {
        const coord = retornarCoordenadasCelulaMaisProximaMouse(mouseX, mouseY, inicioSelecao = false);
        const selecao = {
            inicialX: selecaoAtual.indiceInicialX,
            inicialY: selecaoAtual.indiceInicialY,
            finalX: coord.indiceX,
            finalY: coord.indiceY,
            cor: selecaoAtual.cor
        }

        // Verifica se a seleção corresponde a alguma palavra na lista e circula a palavra se necessário
        listaPalavras.forEach((objPalavra) => {
            const { xInicial, yInicial, xFinal, yFinal } = objPalavra;
            if (!objPalavra.palavraEstaCirculada
                &&
                (
                    (
                        selecao.inicialX === xInicial
                        && selecao.inicialY === yInicial
                        && selecao.finalX === xFinal
                        && selecao.finalY === yFinal
                    )
                    ||
                    (
                        selecao.inicialX === xFinal
                        && selecao.inicialY === yFinal
                        && selecao.finalX === xInicial
                        && selecao.finalY === yInicial
                    )
                )
            ) {
                objPalavra.palavraEstaCirculada = true;
                objPalavra.cor = selecao.cor;
            }
        });

        // Limpa a seleção atual após o término
        selecaoAtual = {
            indiceInicialX: undefined,
            indiceInicialY: undefined,
            posicaoInicialX: undefined,
            posicaoInicialY: undefined,
            cor: colorWordBg
        };
    };
    
    // Função para redefinir a seleção atual do mouse
    const limparSelecaoMouse = () => {
        selecaoAtual = {
            indiceInicialX: undefined,
            indiceInicialY: undefined,
            posicaoInicialX: undefined,
            posicaoInicialY: undefined,
            cor: colorWordBg
        };
    };

    // Retorna um objeto com todas as funções disponíveis para interagir com o caça-palavras
    return {
        inicializar,
        adicionarPalavra,
        atualizarGridNoDOM,
        circularPalavraMouse,
        iniciarSelecaoPalavraMouse,
        finalizarSelecaoPalavraMouse,
        limparSelecaoMouse
    };
}

// Seleciona o elemento da grade do caça-palavras no DOM
const divGrid = gridCaçaPalavras;
 
// Cria a grade do caça-palavras com 15 linhas, 15 colunas e desabilita palavras invertidas
const grid = createGrid(divGrid, 12, 12, { habilitarPalavrasInvertidas: false });

// Função para configurar o caça-palavras
function setup() {
   // Inicializa a grade do caça-palavras
    grid.inicializar();
     // Lista de palavras para serem adicionadas ao caça-palavras
    const listaPalavras = [
        "VERBO",
        "SUBSTANTIVO",
        "ADJETIVO",
        "SILABA",
        "AMBOS",
        "SINÔNIMOS",
        "OBJETO",
    ];

     // Adiciona as palavras ao caça-palavras
    listaPalavras.forEach((palavra, indice) => {
        grid.adicionarPalavra(palavra);
        //if(indice < 10) grid.circularPalavra(palavra);
    });

    // Obtém as coordenadas de deslocamento do elemento da grade
    const { left: gridLeft, top: gridTop } = divGrid.getBoundingClientRect();
    
     // Variável para controlar se o botão do mouse está pressionado
    let isMouseDown = false;

     // Adiciona um ouvinte para o movimento do mouse 
    document.body.addEventListener("mousemove", ({ clientX, clientY, target }) => {
        // Verifica se o movimento ocorre dentro do canvas de seleção de palavras
        if (target.classList.contains('canvas-selecao-palavras')) {
            // Chama a função para circular a palavra durante o movimento do mouse
            grid.circularPalavraMouse(clientX - gridLeft, clientY - gridTop, isMouseDown);
        }
        else {
            // Limpa a seleção se o movimento ocorrer fora do canvas
            grid.limparSelecaoMouse();
        }
    });

     // Adiciona um ouvinte para o clique do mouse na grade
    divGrid.addEventListener("mousedown", ({ clientX, clientY }) => {
        // Define que o botão do mouse está pressionado
        isMouseDown = true;
        // Inicia a seleção da palavra com o clique do mouse
        grid.iniciarSelecaoPalavraMouse(clientX - gridLeft, clientY - gridTop);
    });

    // Adiciona um ouvinte para o evento de soltar o botão do mouse em qualquer parte do corpo
    document.body.addEventListener("mouseup", ({ clientX, clientY }) => {
        // Define que o botão do mouse não está pressionado
        isMouseDown = false
         // Finaliza a seleção da palavra com o evento de soltar o botão do mouse
        grid.finalizarSelecaoPalavraMouse(clientX - gridLeft, clientY - gridTop);
    });
}

 // Função loop para atualizar a grade no DOM
function loop() {
    grid.atualizarGridNoDOM();
}

 // Configuração inicial
setup();

  // Chama a função loop para atualizar a grade no DOM
loop();

// Define um intervalo para chamar a função loop a cada 50 milissegundos
const loopInterval = setInterval(() => {
    loop();
}, 50);

const [palavras, setPalavras] = useState([]);
  const [grid, setGrid] = useState([]);

  const handleAddPalavra = (palavra) => {
    setPalavras([...palavras, palavra]);
  };

  const handleAddCelula = (indiceX, indiceY) => {
    setGrid([...grid, { indiceX, indiceY }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Caça-Palavras</Text>

      <ScrollView>
        <View style={styles.listaPalavras}>
          {palavras.map((palavra, index) => (
            <Text key={index} style={styles.palavra}>{palavra}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {grid.map((celula, index) => (
            <View key={index} style={styles.celula}>
              <Text>{celula.indiceX} - {celula.indiceY}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listaPalavras: {
    width: '100%',
    marginTop: 10,
  },
  palavra: {
    fontSize: 16,
  },
  grid: {
    width: '100%',
    height: 200,
    border: 1,
    borderRadius: 5,
    margin: 10,
  },
  celula: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default App;
   