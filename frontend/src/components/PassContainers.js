import React from "react";
import "../styles/PassContainers.css";

function PassContainers() {
  return (
    <div className="pass-containers">
      {/* PRO PASS Container */}
      <div className="pass-container pro-pass">
        <div className="pass-header">
          <h2 className="pass-title">PRO PASS</h2>
          <p className="pass-subtitle">ЛУЧШЕЕ, ЧТО МОЖНО КУПИТЬ (после Brawl Pass 😉)</p>
        </div>

        <div className="pass-duration">
          <span className="duration-icon">📅</span>
          <p>Длится 4 месяца и приурочен к главным турнирам: Brawl Cup, отборочные, мировой финал!</p>
        </div>

        <h3 className="pass-content-title">🎁 ЧТО ВХОДИТ В PRO PASS?</h3>

        <div className="pass-features">
          <div className="feature-item">

            <div className="feature-image image-slider">
              <div className="feature-image image-slider">
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk1.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk2.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk3.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk4.png" />
              </div>
            </div>
            <div className="feature-description">
              <p><span className="emoji">🔥</span> <strong>5 улучшений для рангового скина</strong> — уникальные эффекты и анимации, с каждым уровнем скин становится круче!</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-image">
              <div className="feature-image image-slider">
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk4.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk3.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk2.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk1.png" />
              </div>
            </div>
            <div className="feature-description">
              <p><span className="emoji">💎</span> <strong>600 кристаллов</strong> — выгоднее, чем любые другие акции!</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-image">
              <div className="feature-image image-slider">
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk3.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk1.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk4.png" />
                <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_pp_perk2.png" />
              </div>
            </div>
            <div className="feature-description">
              <p><span className="emoji">🪙</span> <strong>10 000 монет</strong></p>
              <p><span className="emoji">🎖️</span> <strong>11 значков</strong>, <span className="emoji">🖌️</span> <strong>2 спрея</strong>, <span className="emoji">👤</span> <strong>3 иконки профиля</strong> — для стиля и самовыражения!</p>
            </div>
          </div>
        </div>

        <button className="buy-pass-button pro-pass-button">КУПИТЬ PRO PASS</button>
      </div>

      {/* BRAWL PASS PLUS Container */}
      <div className="pass-container brawl-pass-plus">
        <div className="pass-header">
          <h2 className="pass-title">BRAWL PASS PLUS</h2>
          <p className="pass-subtitle">СТАРТУЙ С ПРЕИМУЩЕСТВАМИ</p>
        </div>

        <div className="pass-features">

          <div className="feature-item">
            <div className="feature-image image-slider">
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk1_1.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk1_2.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk1_3.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk1_4.png" />
            </div>
            <div className="feature-description">
              <p><span className="emoji">⚔️</span> <strong>Разблокировка бойца (до эпической редкости)</strong></p>
              <p><span className="emoji">📈</span> +30% прогресса при покупке</p>
              <p><span className="emoji">💰</span> Больше кредитов, очков силы и монет!</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-image image-slider">
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk2_1.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk2_2.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk2_3.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk2_4.png" />
            </div>
            <div className="feature-description">
              <p><span className="emoji">🎨</span> <strong>Сезонный эксклюзивный скин</strong></p>
              <p><span className="emoji">🖌️</span> Значки, спреи и иконки профиля</p>
              <p><span className="emoji">🎨</span> <strong>2 цветовых варианта</strong> скина</p>
              <p><span className="emoji">🏷️</span> <strong>Сезонный титул</strong> на боевой карте</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-image image-slider">
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk3_1.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk3_2.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk3_3.png" />
            </div>
            <div className="feature-description">
              <p><span className="emoji">🎁</span> <strong>Привилегии пропуска</strong>: <span className="emoji">🎁</span> ежедневный подарок в магазине <span className="emoji">⚔️</span> удвоенный опыт <span className="emoji">📅</span> дополнительный квест дня <span className="emoji">🌟</span> премиальные сезонные квесты</p>
              <p><span className="emoji">💎</span> <strong>Кристаллы и блинги</strong> — ещё больше!</p>
            </div>
          </div>
        </div>

        <button className="buy-pass-button brawl-pass-plus-button">КУПИТЬ BRAWL PASS PLUS</button>
      </div>

      {/* Regular BRAWL PASS Container */}
      <div className="pass-container brawl-pass">
        <div className="pass-header">
          <h2 className="pass-title">BRAWL PASS</h2>
          <p className="pass-subtitle">ТОЖЕ НЕПЛОХ!</p>
        </div>

        <div className="pass-features">
          <div className="feature-item">
            <div className="feature-image image-slider">
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk3_1.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk3_2.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk3_3.png" />
            </div>
            <div className="feature-description">
              <p><span className="emoji">🔓</span> Разблокируй бойца до эпической редкости</p>
              <p><span className="emoji">📦</span> Получай больше кредитов, монет и очков силы</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-image image-slider">
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk2_1.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk2_2.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk2_3.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk2_4.png" />
            </div>
            <div className="feature-description">
              <p><span className="emoji">👕</span> Сезонный скин, значки, спреи и иконки профиля</p>
              <p><span className="emoji">🕐</span> Скины остаются эксклюзивными 1 год</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-image image-slider">
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk1_1.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk1_2.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk1_3.png" />
              <img alt="Иконка рангового скина" width="100" height="auto" src="/img/bs_bpp_perk1_4.png" />
            </div>
            <div className="feature-description">
              <p><span className="emoji">🎁</span> Подарки, опыт, квесты и конечно — кристаллы и блинги!</p>
            </div>
          </div>
        </div>

        <button className="buy-pass-button brawl-pass-button">КУПИТЬ BRAWL PASS</button>
      </div>

      <div className="pass-conclusion">
        <h3>💬 ВЫВОД:</h3>
        <ul>
          <li>Хочешь максимум от рангового режима — бери <strong>Pro Pass</strong></li>
          <li>Хочешь больше бойцов, прогресса и плюшек — <strong>Brawl Pass Plus</strong></li>
          <li>Хочешь просто прокачку и скины — <strong>Brawl Pass</strong></li>
        </ul>
      </div>
    </div>
  );
}

export default PassContainers;