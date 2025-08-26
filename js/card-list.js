document.addEventListener('DOMContentLoaded', function () {
    const cardListWrap = document.querySelector('.card-list-wrap');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    // オリジナルの要素にくっつける
    const cardList = document.querySelector('.card-list');
    // NodeListが返る cloneをつくるためのメモ
    const cards = document.querySelectorAll('.card-list .card');

    if (!cardListWrap || !leftArrow || !rightArrow || cards.length === 0) {
        console.error('必要な要素が見つかりません。');
        return;
    }

    //ルート要素のフォントサイズを取得
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    // cardList 要素の gap スタイルを取得
    const gapStyle = getComputedStyle(cardList).gap;
    let gapPx;
    if (gapStyle.includes('rem')) {
        gapPx = parseFloat(gapStyle) * rootFontSize;
    } else if (gapStyle.includes('px')) {
        gapPx = parseFloat(gapStyle);
    } else {
        gapPx = 3 * rootFontSize; // 3 * 10
    }

    // clone original clone
    const cardWidth = cards[0].offsetWidth; // カード1枚の幅
    const cardAndGapWidth = cardWidth + gapPx; // カードとギャップを合わせた幅

    // スクロールする単位（1枚のカード分）
    const scrollStep = cardAndGapWidth;

    // --- 無限ループのためのクローン処理 ---
    const numOriginalCards = cards.length;
    // オリジナルと同じ枚数を前後に追加することで、十分なループ範囲を確保
    const clonesCount = numOriginalCards;

    // 末尾にクローンを追加 (右スクロール用)
    for (let i = 0; i < clonesCount; i++) {
        const cloneCard = cards[i].cloneNode(true);
        cardList.appendChild(cloneCard);
    }

    // 先頭にクローンを追加 (左スクロール用)
    for (let i = clonesCount - 1; i >= 0; i--) {
        const cloneCard = cards[i].cloneNode(true);
        cardList.prepend(cloneCard);
    }

    // 初期スクロール位置を調整し、元のカードリストの先頭が見えるようにする
    // clone original clone 並びだから、clone分動かす。
    // クローンされたカード群の直後の位置に設定
    let currentScrollPosition = clonesCount * cardAndGapWidth;
    cardListWrap.scrollLeft = currentScrollPosition;

    // スクロール中フラグ
    let isScrolling = false;
    let scrollTimeoutId; // スクロール停止を検知するためのID

    // スクロールを止めた時、クローンを見ていたら、オリジナルの位置に変える
    // スクロール後の位置調整関数
    function adjustLoopPosition() {
        // 現在の cardListWrap 要素の物理的なスクロール位置
        const currentPhysicalScroll = cardListWrap.scrollLeft;
        // オリジナルのスタート
        const originalSectionStart = clonesCount * cardAndGapWidth;
        // オリジナルのエンド
        const originalSectionEnd = originalSectionStart + (numOriginalCards * cardAndGapWidth);

        // スクロール位置がオリジナルセクションの外に出た場合
        if (currentPhysicalScroll >= originalSectionEnd) {
            // 右端を超えたら、元のリストの先頭に対応する位置へジャンプ
            const jumpBackTo = originalSectionStart + (currentPhysicalScroll - originalSectionEnd);
            cardListWrap.scrollLeft = jumpBackTo;
            currentScrollPosition = jumpBackTo; // 論理的な位置も更新
        } else if (currentPhysicalScroll < originalSectionStart) {
            // 左端を超えたら、元のリストの末尾に対応する位置へジャンプ
            const jumpBackTo = originalSectionEnd - (originalSectionStart - currentPhysicalScroll);
            cardListWrap.scrollLeft = jumpBackTo;
            currentScrollPosition = jumpBackTo; // 論理的な位置も更新
        } else {
            // オリジナルセクション内にいる場合、物理的な位置を論理的な位置として保持
            currentScrollPosition = currentPhysicalScroll;
        }
        isScrolling = false; // スクロール完了（または手動スクロール停止）
    }

    // `scroll` イベントリスナー: 手動スクロールまたは `scrollTo` の完了を検知
    cardListWrap.addEventListener('scroll', function () {
        // スクロール中に次のスクロール調整を予約している場合はキャンセル
        clearTimeout(scrollTimeoutId);

        // スクロールが停止してから次のadjustLoopPositionを予約する
        scrollTimeoutId = setTimeout(() => {
            adjustLoopPosition();
        }, 100);
    });

    // 右矢印クリック時の処理
    rightArrow.addEventListener('click', function () {
        if (isScrolling) return; // スクロール中は二重クリック防止
        isScrolling = true; // クリックによるスクロール開始

        // スクロールアニメーションの目標位置
        // scrollStep スクロールする単位（例: 1枚のカード分）
        const targetScrollLeft = currentScrollPosition + scrollStep;

        cardListWrap.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
    });


    // 左矢印クリック時の処理
    leftArrow.addEventListener('click', function () {
        if (isScrolling) return; // スクロール中は二重クリック防止
        isScrolling = true; // クリックによるスクロール開始

        // スクロールアニメーションの目標位置
        const targetScrollLeft = currentScrollPosition - scrollStep;

        cardListWrap.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
    });
});