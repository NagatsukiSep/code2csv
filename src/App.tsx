import React, { useState } from 'react';
import './App.css';

function App() {
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  interface Card {
    name: string;
    imagePath: string;
  }
  interface CardDict {
    [id: string]: Card;
  }
  const cardDict: CardDict = {};

  const handleConvertClick = async () => {
    try {
      const deckCode = (document.getElementById('deckCode') as HTMLInputElement).value;
      if (deckCode === '') {
        setMessage('Please enter a deck code');
        return;
      }
      const response = await fetch('https://www.pokemon-card.com/deck/confirm.html/deckID/' + deckCode);
      const data = await response.text();
      // console.log('Success:', data);
      GenCardDict(data);
      GetCardAmount(data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error:' + error);
    }
  };

  function GenCardDict(inputString: string) {
    const pattern = /NameAlt\[(\d+)\]='(.+)';[\s\S]{2}PCGDECK\.searchItemCardPict\[\d+\]='(.+)'/g;
    // console.log(inputString);
    let match;
    while ((match = pattern.exec(inputString)) !== null) {
      const [, id, name, imagePath] = match;
      cardDict[id] = { name, imagePath };
    }
    // console.log(cardDict);
  };

  function GetCardAmount(inputString: string) {
    let csvText = 'QTY,Name,Type,URL\n';

    const amount_pattern = /(\d+)_(\d)/g;

    let match;

    const pke_pattern = /id="deck_pke"[\s\S]value="(.+)"/g;
    const pke_match = pke_pattern.exec(inputString);
    const pke = pke_match ? pke_match[1] : '';
    while ((match = amount_pattern.exec(pke)) !== null) {
      const [, id, amount] = match;
      csvText += `${amount},${cardDict[id].name},Pokémon,https://www.pokemon-card.com${cardDict[id].imagePath}\n`;
    }

    const gds_pattern = /id="deck_gds"[\s\S]value="(.+)"/g;
    const gds_match = gds_pattern.exec(inputString);
    const gds = gds_match ? gds_match[1] : '';
    while ((match = amount_pattern.exec(gds)) !== null) {
      const [, id, amount] = match;
      csvText += `${amount},${cardDict[id].name},Trainer,https://www.pokemon-card.com${cardDict[id].imagePath}\n`;
    }

    const tool_pattern = /id="deck_tool"[\s\S]value="(.+)"/g;
    const tool_match = tool_pattern.exec(inputString);
    const tool = tool_match ? tool_match[1] : '';
    while ((match = amount_pattern.exec(tool)) !== null) {
      const [, id, amount] = match;
      csvText += `${amount},${cardDict[id].name},Trainer,https://www.pokemon-card.com${cardDict[id].imagePath}\n`;
    }

    const sup_pattern = /id="deck_sup"[\s\S]value="(.+)"/g;
    const sup_match = sup_pattern.exec(inputString);
    const sup = sup_match ? sup_match[1] : '';
    while ((match = amount_pattern.exec(sup)) !== null) {
      const [, id, amount] = match;
      csvText += `${amount},${cardDict[id].name},Trainer,https://www.pokemon-card.com${cardDict[id].imagePath}\n`;
    }

    const sta_pattern = /id="deck_sta"[\s\S]value="(.+)"/g;
    const sta_match = sta_pattern.exec(inputString);
    const sta = sta_match ? sta_match[1] : '';
    while ((match = amount_pattern.exec(sta)) !== null) {
      const [, id, amount] = match;
      csvText += `${amount},${cardDict[id].name},Trainer,https://www.pokemon-card.com${cardDict[id].imagePath}\n`;
    }

    const ene_pattern = /id="deck_ene"[\s\S]value="(.+)"/g;
    const ene_match = ene_pattern.exec(inputString);
    const ene = ene_match ? ene_match[1] : '';
    while ((match = amount_pattern.exec(ene)) !== null) {
      const [, id, amount] = match;
      csvText += `${amount},${cardDict[id].name},Energy,https://www.pokemon-card.com${cardDict[id].imagePath}\n`;
    }

    setResult(csvText);
    setMessage('Success');
    // console.log(csvText);
  }

  function downloadCSV(csvText: string, filename: string) {
    const blob = new Blob([csvText], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    filename = (document.getElementById('deckCode') as HTMLInputElement).value;
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }


  return (
    <div>
      <h1>code2csv</h1>
      <p><a href='https://www.pokemon-card.com/'>ポケモンカードゲームトレーナーズウェブサイト</a>で作成したデッキを<a href='https://ptcgsim.online/'>ptcgsim.online</a>のデッキフォーマットに対応したcsvファイルを生成します。</p>
      <p>デッキコードを入力してConvertボタンをクリックするとcsvファイルが生成されます。Downloadからcsvファイルをダウンロードして<a href='https://ptcgsim.online/'>ptcgsim.online</a>のUpload Fileからアップロードしてください。</p>
      <input type='text' id='deckCode' placeholder='Enter your code here'></input>
      <button onClick={handleConvertClick}>Convert</button>
      <div>
        <p>{message}</p>
      </div>
      {message === 'Success' && <div>
        <button onClick={() => downloadCSV(result, 'deck.csv')}>Download</button>
      </div>}
      <p>バグ報告やご意見・ご要望は<a href='https://twitter.com/atz_pcg'>@atz_pcg</a>まで</p>

    </div>
  );
}

export default App;
