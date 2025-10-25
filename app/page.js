'use client';

import { useState, useEffect } from 'react';

const houses = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

const spells = [
  { name: 'Expelliarmus', description: 'Disarming Charm', power: 50, type: 'defense' },
  { name: 'Stupefy', description: 'Stunning Spell', power: 60, type: 'attack' },
  { name: 'Protego', description: 'Shield Charm', power: 40, type: 'defense' },
  { name: 'Expecto Patronum', description: 'Patronus Charm', power: 80, type: 'special' },
  { name: 'Lumos', description: 'Light Spell', power: 20, type: 'utility' },
  { name: 'Accio', description: 'Summoning Charm', power: 30, type: 'utility' },
  { name: 'Petrificus Totalus', description: 'Full Body-Bind', power: 70, type: 'attack' },
  { name: 'Wingardium Leviosa', description: 'Levitation Charm', power: 25, type: 'utility' },
];

const enemies = [
  { name: 'Death Eater', hp: 100, power: 15, img: '💀' },
  { name: 'Dementor', hp: 120, power: 20, img: '👻' },
  { name: 'Dark Wizard', hp: 150, power: 25, img: '🧙‍♂️' },
  { name: 'Basilisk', hp: 200, power: 30, img: '🐍' },
];

export default function WizardGame() {
  const [gameState, setGameState] = useState('start'); // start, house, game, victory, defeat
  const [playerName, setPlayerName] = useState('');
  const [playerHouse, setPlayerHouse] = useState('');
  const [playerHP, setPlayerHP] = useState(100);
  const [playerMana, setPlayerMana] = useState(100);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerExp, setPlayerExp] = useState(0);
  const [learnedSpells, setLearnedSpells] = useState([spells[0], spells[2], spells[4]]);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyHP, setEnemyHP] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [score, setScore] = useState(0);
  const [defeatedEnemies, setDefeatedEnemies] = useState(0);

  const houseColors = {
    Gryffindor: { bg: '#740001', text: '#D3A625' },
    Slytherin: { bg: '#1A472A', text: '#5D5D5D' },
    Ravenclaw: { bg: '#0E1A40', text: '#946B2D' },
    Hufflepuff: { bg: '#FFD800', text: '#000000' },
  };

  const startGame = () => {
    if (playerName.trim()) {
      setGameState('house');
    }
  };

  const selectHouse = (house) => {
    setPlayerHouse(house);
    setGameState('game');
    spawnEnemy();
  };

  const spawnEnemy = () => {
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const scaledEnemy = {
      ...enemy,
      hp: enemy.hp + (playerLevel - 1) * 20,
      power: enemy.power + (playerLevel - 1) * 5,
    };
    setCurrentEnemy(scaledEnemy);
    setEnemyHP(scaledEnemy.hp);
    setBattleLog([`A wild ${scaledEnemy.name} appears!`]);
  };

  const castSpell = (spell) => {
    if (playerMana < 20) {
      addLog('Not enough mana!');
      return;
    }

    setPlayerMana(prev => Math.max(0, prev - 20));

    const damage = spell.power + Math.floor(Math.random() * 20);
    const newEnemyHP = Math.max(0, enemyHP - damage);
    setEnemyHP(newEnemyHP);
    addLog(`You cast ${spell.name}! Dealt ${damage} damage.`);

    if (newEnemyHP <= 0) {
      const expGain = currentEnemy.hp;
      const scoreGain = currentEnemy.hp * 2;
      setPlayerExp(prev => prev + expGain);
      setScore(prev => prev + scoreGain);
      setDefeatedEnemies(prev => prev + 1);
      addLog(`${currentEnemy.name} defeated! +${expGain} EXP, +${scoreGain} points`);

      if (playerExp + expGain >= playerLevel * 100) {
        levelUp();
      }

      setTimeout(() => {
        if (defeatedEnemies + 1 >= 10) {
          setGameState('victory');
        } else {
          spawnEnemy();
        }
      }, 1500);
    } else {
      setTimeout(enemyAttack, 1000);
    }
  };

  const enemyAttack = () => {
    const damage = currentEnemy.power + Math.floor(Math.random() * 10);
    const newPlayerHP = Math.max(0, playerHP - damage);
    setPlayerHP(newPlayerHP);
    addLog(`${currentEnemy.name} attacks! You take ${damage} damage.`);

    if (newPlayerHP <= 0) {
      setGameState('defeat');
    }

    setPlayerMana(prev => Math.min(100, prev + 10));
  };

  const levelUp = () => {
    setPlayerLevel(prev => prev + 1);
    setPlayerExp(0);
    setPlayerHP(100);
    setPlayerMana(100);
    addLog('⭐ Level Up! HP and Mana restored!');

    if (learnedSpells.length < spells.length) {
      const newSpell = spells.find(s => !learnedSpells.includes(s));
      if (newSpell) {
        setLearnedSpells(prev => [...prev, newSpell]);
        addLog(`📚 Learned new spell: ${newSpell.name}!`);
      }
    }
  };

  const addLog = (message) => {
    setBattleLog(prev => [...prev.slice(-4), message]);
  };

  const resetGame = () => {
    setGameState('start');
    setPlayerName('');
    setPlayerHouse('');
    setPlayerHP(100);
    setPlayerMana(100);
    setPlayerLevel(1);
    setPlayerExp(0);
    setLearnedSpells([spells[0], spells[2], spells[4]]);
    setCurrentEnemy(null);
    setEnemyHP(0);
    setBattleLog([]);
    setScore(0);
    setDefeatedEnemies(0);
  };

  const colors = playerHouse ? houseColors[playerHouse] : { bg: '#2C003E', text: '#FFD700' };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.bg} 0%, #000000 100%)`,
      color: colors.text,
      fontFamily: 'Georgia, serif',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {gameState === 'start' && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '500px',
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', textShadow: '2px 2px 4px #000' }}>
            ⚡ Harry Potter Wizard Game ⚡
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '30px' }}>Enter your wizard name</p>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && startGame()}
            placeholder="Your name..."
            style={{
              padding: '15px',
              fontSize: '18px',
              width: '300px',
              borderRadius: '8px',
              border: '2px solid #FFD700',
              background: 'rgba(255,255,255,0.9)',
              marginBottom: '20px',
            }}
          />
          <br />
          <button
            onClick={startGame}
            style={{
              padding: '15px 40px',
              fontSize: '20px',
              background: '#FFD700',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            Begin Your Journey
          </button>
        </div>
      )}

      {gameState === 'house' && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '600px',
        }}>
          <h2 style={{ fontSize: '36px', marginBottom: '30px' }}>
            Choose Your House, {playerName}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}>
            {houses.map(house => (
              <button
                key={house}
                onClick={() => selectHouse(house)}
                style={{
                  padding: '30px',
                  fontSize: '24px',
                  background: houseColors[house].bg,
                  color: houseColors[house].text,
                  border: '3px solid ' + houseColors[house].text,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {house}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'game' && currentEnemy && (
        <div style={{ maxWidth: '900px', width: '100%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            background: 'rgba(0,0,0,0.7)',
            padding: '15px',
            borderRadius: '10px',
          }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{playerName}</div>
              <div>🏰 {playerHouse} | ⭐ Level {playerLevel}</div>
              <div>❤️ HP: {playerHP}/100 | 💙 Mana: {playerMana}/100</div>
              <div>📊 EXP: {playerExp}/{playerLevel * 100}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Score: {score}</div>
              <div>Defeated: {defeatedEnemies}/10</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '60px', marginBottom: '10px' }}>{currentEnemy.img}</div>
            <h2 style={{ fontSize: '32px', margin: '10px 0' }}>{currentEnemy.name}</h2>
            <div style={{
              background: '#333',
              height: '30px',
              borderRadius: '15px',
              overflow: 'hidden',
              marginBottom: '10px',
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #ff0000, #ff6666)',
                height: '100%',
                width: `${(enemyHP / currentEnemy.hp) * 100}%`,
                transition: 'width 0.3s',
              }}></div>
            </div>
            <div style={{ fontSize: '18px' }}>HP: {enemyHP}/{currentEnemy.hp}</div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            minHeight: '120px',
          }}>
            <h3 style={{ marginTop: 0 }}>Battle Log:</h3>
            {battleLog.map((log, i) => (
              <div key={i} style={{ padding: '5px 0', opacity: 0.7 + (i * 0.1) }}>{log}</div>
            ))}
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '20px',
            borderRadius: '15px',
          }}>
            <h3 style={{ marginTop: 0 }}>Cast a Spell:</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
            }}>
              {learnedSpells.map(spell => (
                <button
                  key={spell.name}
                  onClick={() => castSpell(spell)}
                  disabled={playerMana < 20}
                  style={{
                    padding: '15px',
                    background: playerMana < 20 ? '#666' : '#8B0000',
                    color: '#FFD700',
                    border: '2px solid #FFD700',
                    borderRadius: '8px',
                    cursor: playerMana < 20 ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                >
                  <div>{spell.name}</div>
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                    {spell.description} | ⚡{spell.power}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '500px',
        }}>
          <h1 style={{ fontSize: '48px', color: '#FFD700' }}>🎉 Victory! 🎉</h1>
          <p style={{ fontSize: '24px', margin: '20px 0' }}>
            Congratulations, {playerName} of {playerHouse}!
          </p>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>
            Final Score: {score}
          </div>
          <div style={{ fontSize: '20px', marginBottom: '30px' }}>
            Level {playerLevel} | Defeated {defeatedEnemies} enemies
          </div>
          <button
            onClick={resetGame}
            style={{
              padding: '15px 40px',
              fontSize: '20px',
              background: '#FFD700',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {gameState === 'defeat' && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(0,0,0,0.7)',
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '500px',
        }}>
          <h1 style={{ fontSize: '48px', color: '#8B0000' }}>💀 Defeated 💀</h1>
          <p style={{ fontSize: '24px', margin: '20px 0' }}>
            The dark forces were too strong...
          </p>
          <div style={{ fontSize: '28px', marginBottom: '20px' }}>
            Score: {score}
          </div>
          <div style={{ fontSize: '18px', marginBottom: '30px' }}>
            Defeated {defeatedEnemies} enemies before falling
          </div>
          <button
            onClick={resetGame}
            style={{
              padding: '15px 40px',
              fontSize: '20px',
              background: '#FFD700',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
