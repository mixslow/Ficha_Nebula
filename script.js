const RAÇA_CLASSE = {
    racas: {
        "Andróide": { int_b: 2, for_b: 1, sab_b: -1 },
        "Celeosk": { int_b: 2, sab_b: 1, for_b: -1 },
        "Conduir": { per_b: 2, des_b: 1, con_b: -1 },
        "Demonsk": { con_b: 2, sab_b: 1, car_b: -1 },
        "Elfim": { sab_b: 2, per_b: 1, int_b: -1 },
        "Humano": { },
        "Krajuru": { per_b: 2, des_b: 1, con_b: -1 },
        "Muron": { con_b: 2, for_b: 1, per_b: -1 },
        "Nebulofita": { car_b: 2, int_b: 1, sab_b: -1 },
        "Reptiliano": { des_b: 2, for_b: 1, car_b: -1  },
        "Slimud": { per_b: 2, des_b: 1, per_b: -1 },
        "Tiano": { for_b: 2, con_b: 1, int_b: -1 },
        "Tribuiru": { des_b: 2, sab_b: 1, car_b: -1 },
        "Venomud": { sab_b: 2, des_b: 1, for_b: -1 },
        "Híbrido": {},
    },
    classes: {
        "Apostador": { hp_base: 7, hp_level: 2, ca_base: 15 },
        "Atirador": { hp_base: 9, hp_level: 2, ca_base: 15 },
        "Berserker": { hp_base: 12, hp_level: 3, ca_base: 15 },
        "Caçador": { hp_base: 10, hp_level: 3, ca_base: 15 },
        "Contador de Odisséia": { hp_base: 8, hp_level: 1, ca_base: 15 },
        "Devotado": { hp_base: 9, hp_level: 2, ca_base: 15 },
        "Dobrador": { hp_base: 8, hp_level: 2, ca_base: 15 },
        "Inventor": { hp_base: 10, hp_level: 2, ca_base: 15 },
        "Lutador": { hp_base: 9, hp_level: 3, ca_base: 15 },
        "Médico": { hp_base: 9, hp_level: 1, ca_base: 15 },
        "Piloto": { hp_base: 8, hp_level: 3, ca_base: 15 },
        "Samurai": { hp_base: 12, hp_level: 2, ca_base: 15 },
        "Tanque": { hp_base: 10, hp_level: 3, ca_base: 15 },
        "Taoísta": { hp_base: 7, hp_level: 2, ca_base: 15 },
    }
};

function carregarFicha() {
    const salvo = localStorage.getItem('dadosFichaNebula');
    if (salvo) {
        const dados = JSON.parse(salvo);
        Object.keys(dados).forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                if (campo.type === "checkbox") {
                    campo.checked = dados[id];
                } else {
                    campo.value = dados[id];
                }
            }
        });
    }
    calc();
}

function calc() {
    // 1. Funções auxiliares
    const v = (id) => parseInt(document.getElementById(id)?.value) || 0;
    const t = (id) => document.getElementById(id)?.checked || false;
    const s = (id) => document.getElementById(id)?.value || "";
    
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === "SPAN" || el.tagName === "P" || el.tagName === "DIV") {
            el.innerText = val;
        } else {
            el.value = val;
        }
    };

    // --- BLOCO DE VALIDAÇÃO (Corrigido para permitir apagar) ---
    const inputNivel = document.getElementById('nivel');
    
    // Pegamos o valor bruto do input
    let nivelBruto = inputNivel?.value; 
    
    // Se o campo estiver vazio, usamos 1 para o cálculo, mas NÃO forçamos o valor no input ainda
    let nivelVal = parseInt(nivelBruto) || 1; 

    if (nivelBruto !== "") { // Só valida limites se o usuário não estiver apagando tudo
        if (nivelVal > 15) {
            nivelVal = 15;
            if (inputNivel) inputNivel.value = 15;
        } else if (nivelVal < 1) {
            nivelVal = 1;
            if (inputNivel) inputNivel.value = 1;
        }
    } else {
        nivelVal = 1; // Valor padrão interno se o campo estiver vazio
    }

    // Agora sim definimos a constante que o seu código já usa lá embaixo
    const nivel = nivelVal;

    // 2. Dados de Raça e Classe
    const racaNome = s('raca');
    const classeNome = s('classe');

    const racaSel = (typeof RAÇA_CLASSE !== 'undefined') ? (RAÇA_CLASSE.racas[racaNome] || {}) : {};
    const classeSel = (typeof RAÇA_CLASSE !== 'undefined') ? (RAÇA_CLASSE.classes[classeNome] || { hp_base: 0, hp_level: 0, ca_base: 10 }) : { hp_base: 10, hp_level: 5, ca_base: 10 };

    // 3. CÁLCULO DOS ATRIBUTOS TOTAIS (Base + Bônus + Raça)
    const FOR = v('for_base') + v('for_bonus') + (racaSel.for_b || 0);
    const CON = v('con_base') + v('con_bonus') + (racaSel.con_b || 0);
    const DES = v('des_base') + v('des_bonus') + (racaSel.des_b || 0);
    const INT = v('int_base') + v('int_bonus') + (racaSel.int_b || 0);
    const SAB = v('sab_base') + v('sab_bonus') + (racaSel.sab_b || 0);
    const PER = v('per_base') + v('per_bonus') + (racaSel.per_b || 0);
    const CAR = v('car_base') + v('car_bonus') + (racaSel.car_b || 0);

    // Atualiza os Spans de Atributo na tela
    set('v_for_total', FOR);
    set('v_con_total', CON);
    set('v_des_total', DES);
    set('v_int_total', INT);
    set('v_sab_total', SAB);
    set('v_per_total', PER);
    set('v_car_total', CAR);

    // 4. CÁLCULO DE HP
    const hpMaximo = (classeSel.hp_base + CON) + ((classeSel.hp_level + CON) * (nivel - 1));
    set('v_hp', hpMaximo);

    // 5. STATUS DO SISTEMA (Baseado no HP Atual)
    const hpAtual = v('hp_atual');
const statusLabel = document.getElementById('status_label');

if (statusLabel) {
    const pct = (hpAtual / hpMaximo) * 100;
    
    // Reset de animações
    statusLabel.classList.remove('flicker');

    // PRIORIDADE MÁXIMA: Coração de Cristal
    if (t('stat_cristal')) {
        set('status_label', "CORAÇÃO CRISTALIZADO");
        statusLabel.style.color = "#ff00ff";
        statusLabel.classList.add('flicker'); 
    } else if (t('stat_hemorragia')) {
    set('status_label', "ERRO: HEMORRAGIA INTERNA EXTREMA");
    statusLabel.style.color = "#ff0000";
    statusLabel.classList.add('flicker'); // A hemorragia também faz o texto piscar!
}
    // Se não houver cristal, segue a lógica normal de HP
    else if (hpAtual <= 0) { 
        set('status_label', "INOPERANTE"); 
        statusLabel.style.color = "#ff0000"; 
    } else if (pct < 20) { 
        set('status_label', "CRÍTICO"); 
        statusLabel.style.color = "#ff4500"; 
    } else if (pct < 50) { 
        set('status_label', "ALERTA"); 
        statusLabel.style.color = "#ffff00"; 
    } else { 
        set('status_label', "OPERANTE"); 
        statusLabel.style.color = "#00ff00"; 
    }
}

    // 6. LÓGICA DA CA (DEFINIÇÃO POR CLASSE)
    let bDefesa = DES; // Padrão é Destreza
    
    if (['Lutador', 'Berserker', 'Samurai', 'Tanque'].includes(classeNome)) {
        bDefesa = CON;
    } else if (['Caçador', 'Devotado', 'Inventor', 'Médico'].includes(classeNome)) {
        bDefesa = PER;
    }

    const bonusExternoCA = v('ca_bonus');
    const caFinal = (classeSel.ca_base || 10) + bDefesa + bonusExternoCA;
    set('v_ca', caFinal);

    // 7. CÁLCULO DE NEBULA
    const nebulaMax = 20 + (Math.floor(nivel / 5) * 10);
    set('v_nebula_max', nebulaMax);

    // 8. APTIDÕES (Usando os valores já somados)
    set('v_ref', t('t_ref') ? (DES + PER) : DES);
    set('v_mir', t('t_mir') ? (PER + " +V") : PER);
    set('v_for', t('t_for') ? (CON + FOR) : CON);
    set('v_acr', t('t_acr') ? (DES + FOR) : DES);
    
    const valConhec = t('t_conh') ? (INT + SAB) : INT;
    set('v_conh', valConhec);
    const valLabia = t('t_lab') ? (CAR + PER) : CAR;
    set('v_lab', valLabia);
    
    set('v_bar', t('t_bar') ? (CAR + valLabia) : CAR);
    set('v_rep', t('t_rep') ? (INT + valConhec) : INT);
    set('v_fur', t('t_fur') ? (DES + " +V") : DES);
    set('v_pil', t('t_pil') ? (DES + 5) : DES);
    set('v_von', t('t_von') ? (CON + INT + FOR + SAB) : (CON + INT));
    // ... adicione as outras conforme sua necessidade, seguindo o padrão acima

    // 9. APLICAÇÃO DE STATUS VISUAL (Sangrando, Envenenado, Eletrizado, Congelado, Cristalizado)
    // --- LÓGICA DE PRIORIDADE VISUAL DO FRAME ---
const frame = document.querySelector('.container-principal');

if (frame) {
    // 1. Limpa todas as classes de status para resetar o visual
    frame.classList.remove('frame-sangue', 'frame-hemorragia', 'frame-veneno', 'frame-eletrizado', 'frame-congelado', 'frame-cristal', 'frame-queimado', 'frame-quebracura', 'frame-potencial-maximo', 'outros-status...');

    // 2. Checagem por Ordem de Importância (O primeiro TRUE para a execução)
    
    if (t('stat_cristal')) {
        // PRIORIDADE 1: Coração de Cristal (Urgência Total)
        frame.classList.add('frame-cristal');
    } 
    else if (t('stat_hemorragia')) {
        // PRIORIDADE 2: Hemorragia (Mais forte que tudo, exceto o Cristal)
        frame.classList.add('frame-hemorragia');
    } 
    else if (t('stat_quebracura')) {
        // PRIORIDADE 2.5: Quebra-Cura (Entre Hemorragia e Sangue)
        frame.classList.add('frame-quebracura');
    }
    else if (t('stat_congelado')) {
        // PRIORIDADE 7: Gelo
        frame.classList.add('frame-congelado');
    }
    else if (t('stat_sangrando')) {
        // PRIORIDADE 3: Sangue/Hemorragia
        frame.classList.add('frame-sangue');
    }
    else if (t('stat_eletrizado')) {
        // PRIORIDADE 4: Eletricidade
        frame.classList.add('frame-eletrizado');
    } else if (t('stat_queimado')) {
        // PRIORIDADE 5: Queimadura (Entre Eletricidade e Veneno)
        frame.classList.add('frame-queimado');
    }
    else if (t('stat_veneno')) {
        // PRIORIDADE 6: Veneno
        frame.classList.add('frame-veneno');
    }
    else if (nivel === 15) {
        frame.classList.add('frame-potencial-maximo');
    }
}
    // Se nenhum estiver marcado, o CSS padrão (Roxo Elétrico) assume o controle
}
// --- 9.5 EFEITO NÍVEL MÁXIMO (VERSÃO BLINDADA) ---
    const campoNivel = document.getElementById('nivel');
    const framePrincipal = document.querySelector('.container-principal');

    if (campoNivel) {
    const nebulaMaxLabel = document.getElementById('v_nebula_max');

    if (nivel === 15) {
        // 1. Nível em Ciano
        campoNivel.classList.add('nivel-maximo-aura');
        campoNivel.style.color = "#bc13fe";
        campoNivel.style.textShadow = "0 0 10px #bc13fe, 0 0 20px #bc13fe";

        // 2. Lógica da Aura do Frame
        const temStatus = t('stat_cristal') || t('stat_hemorragia') || t('stat_sangrando') || 
                t('stat_quebracura') || t('stat_congelado') || t('stat_queimado') || 
                t('stat_veneno') || t('stat_eletrizado');
        
        if (framePrincipal) {
            if (!temStatus) {
                framePrincipal.classList.add('frame-potencial-maximo');
            } else {
                framePrincipal.classList.remove('frame-potencial-maximo');
            }
        }

        // 3. NEBULA MÁXIMA EM ROXO (Forçando com !important se necessário via JS)
        if (nebulaMaxLabel) {
            nebulaMaxLabel.classList.add('nebula-max-purple');
            nebulaMaxLabel.style.setProperty('color', '#bc13fe', 'important');
            nebulaMaxLabel.style.setProperty('text-shadow', '0 0 10px #bc13fe, 0 0 20px #bc13fe', 'important');
            nebulaMaxLabel.style.fontWeight = "bold";
        }

    } else {
        // RESET TOTAL
        campoNivel.classList.remove('nivel-maximo-aura');
        campoNivel.style.color = "";
        campoNivel.style.textShadow = "";
        
        if (framePrincipal) framePrincipal.classList.remove('frame-potencial-maximo');

        if (nebulaMaxLabel) {
            nebulaMaxLabel.classList.remove('nebula-max-purple');
            nebulaMaxLabel.style.color = "";
            nebulaMaxLabel.style.textShadow = "";
            nebulaMaxLabel.style.fontWeight = "";
        }
    }
            const atributos = document.querySelectorAll('.atributo-total'); // use a classe que você usa nos spans de total
    atributos.forEach(at => {
    at.style.color = "#00ffff";
    at.style.transition = "0.5s";
});
        } else {
            campoNivel.classList.remove('nivel-maximo-aura');
            campoNivel.style.color = "";
            campoNivel.style.textShadow = "";
            framePrincipal?.classList.remove('frame-potencial-maximo');
            atributos.forEach(at => {at.style.color = ""; 
});
        }
    

    // 10. SALVAMENTO AUTOMÁTICO
    const dados = {};
    document.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.id) dados[el.id] = el.type === "checkbox" ? el.checked : el.value;
    });
    localStorage.setItem('dadosFichaNebula', JSON.stringify(dados));


// Função para alternar entre as abas "Ficha" e "Inventário"
function alternarAba(aba) {
    const divFicha = document.getElementById('aba-ficha');
    const divInv = document.getElementById('aba-inventario');

    if (aba === 'ficha') {
        divFicha.style.display = 'block';
        divInv.style.display = 'none';
    } else {
        divFicha.style.display = 'none';
        divInv.style.display = 'block';
    }
}

// Reset_Ficha: Limpa todos os campos e reseta a ficha para o estado inicial
document.getElementById('btn_reset').addEventListener('click', function() {
    // Pergunta se o jogador tem certeza (segurança extra)
    const confirmar = confirm("AVISO: Isso apagará todos os dados da ficha atual. Deseja prosseguir com o Wipe?");

    if (confirmar) {
        // 1. Limpa todos os inputs de número e texto
        const inputs = document.querySelectorAll('input, select');

        inputs.forEach(input => {
            if (input.type === 'number') {
                if (input.id === 'nivel') {
                    input.value = 1; // Nível padrão
                } else {
                    input.value = 0; // Ou o valor padrão que você preferir
                }
            } else if (input.type === 'text') {
                input.value = "";
            } else if (input.type === 'SELECT') {
                input.selectedIndex = 0;
            }
        });
        if (document.getElementById('itens_gerais')) {
            document.getElementById('itens_gerais').value = '';
        }

        localStorage

        calc(); 
        
        // Feedback visual no console (opcional)
        console.log("Sistema resetado com sucesso.");

        // 2. Opcional: Se você usa localStorage para salvar a ficha, limpe-o aqui:
        // localStorage.clear();

        // 3. Recarrega a página para resetar os cálculos e o Status
        location.reload();
    }
});


window.onload = carregarFicha;
