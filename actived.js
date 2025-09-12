// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeSmoothScroll();
    initializeAccessibility();
});

// フェードインアニメーション初期化
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // フェードイン要素を監視
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// スムーススクロール機能
function initializeSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - 100;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// アクセシビリティ機能の初期化
function initializeAccessibility() {
    // キーボードナビゲーション検出
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Escapeキーでホームに戻る
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const backButton = document.querySelector('.back-button a');
            if (backButton) {
                window.location.href = backButton.href;
            }
        }
    });

    // 戻るボタンのホバー効果強化
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });

        backButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
}

// スクロール位置に基づく戻るボタンの表示制御
function handleBackButtonVisibility() {
    const backButton = document.querySelector('.back-button');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        backButton.style.opacity = '0.9';
    } else {
        backButton.style.opacity = '1';
    }
}

// パフォーマンス最適化：デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スクロールイベントリスナー（デバウンス付き）
window.addEventListener('scroll', debounce(handleBackButtonVisibility, 100));

// ウィンドウリサイズ時の処理
window.addEventListener('resize', debounce(() => {
    // レスポンシブ対応の追加処理
    adjustLayoutForMobile();
}, 250));

// モバイル向けレイアウト調整
function adjustLayoutForMobile() {
    const isMobile = window.innerWidth <= 768;
    const backButton = document.querySelector('.back-button');
    
    if (isMobile) {
        // モバイル時は戻るボタンのテキストを非表示
        const backText = backButton.querySelector('.back-text');
        if (backText) {
            backText.style.display = 'none';
        }
    } else {
        // デスクトップ時は戻るボタンのテキストを表示
        const backText = backButton.querySelector('.back-text');
        if (backText) {
            backText.style.display = 'inline';
        }
    }
}

// 画像の遅延読み込み
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ページ読み込み時の初期化
window.addEventListener('load', function() {
    // 初期レイアウト調整
    adjustLayoutForMobile();
    
    // 遅延読み込み初期化
    initializeLazyLoading();
    
    // 戻るボタンの初期アニメーション
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        setTimeout(() => {
            backButton.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                backButton.style.transform = 'translateY(0)';
            }, 200);
        }, 500);
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.log('エラーが発生しました:', e.error);
});

// 画像読み込みエラーの処理
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // エラー時は代替画像または非表示
            this.style.display = 'none';
            console.log('画像の読み込みに失敗しました:', this.src);
            
            // 代替テキストを表示
            const altDiv = document.createElement('div');
            altDiv.textContent = this.alt || '画像を読み込めませんでした';
            altDiv.style.padding = '2rem';
            altDiv.style.background = '#f8f9fa';
            altDiv.style.border = '1px solid #dee2e6';
            altDiv.style.borderRadius = '8px';
            altDiv.style.textAlign = 'center';
            altDiv.style.color = '#6c757d';
            
            this.parentNode.insertBefore(altDiv, this.nextSibling);
        });
        
        // 読み込み完了時のフェードイン効果
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
});

// プログラム画像のホバー効果
function initializeProgramImageEffects() {
    const programImages = document.querySelectorAll('.program-image');
    
    programImages.forEach(imageContainer => {
        const img = imageContainer.querySelector('img');
        
        imageContainer.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.05)';
            img.style.filter = 'brightness(1.1)';
        });
        
        imageContainer.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
            img.style.filter = 'brightness(1)';
        });
    });
}

// 最終初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeProgramImageEffects();
});

// ユーザビリティ向上: 長時間のスクロールに対する配慮
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    
    // スクロール終了後の処理
    scrollTimeout = setTimeout(() => {
        // 現在の表示セクションをコンソールに記録（デバッグ用）
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                console.log(`現在表示中のセクション: ${index + 1}`);
            }
        });
    }, 150);
});

// コンタクトボタンのクリック効果
function initializeContactButtonEffects() {
    const contactButtons = document.querySelectorAll('.contact-btn');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // クリック効果のアニメーション
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// CSS for ripple effect (動的に追加)
function addRippleEffectCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .contact-btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ページビジビリティ API を使用してタブがアクティブかどうかを監視
function initializePageVisibility() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('ページが非アクティブになりました');
            // 必要に応じてアニメーションを停止
        } else {
            console.log('ページがアクティブになりました');
            // アニメーションを再開
        }
    });
}

// 印刷時の特別なスタイル処理
function initializePrintStyles() {
    window.addEventListener('beforeprint', function() {
        // 印刷時には背景色を調整
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
}

// 最終的な初期化処理
window.addEventListener('load', function() {
    addRippleEffectCSS();
    initializeContactButtonEffects();
    initializePageVisibility();
    initializePrintStyles();
    
    // ページ読み込み完了をコンソールに記録
    console.log('サブページの読み込みが完了しました');
    
    // パフォーマンス情報の記録
    if (performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
            const loadTime = navigationEntries[0].loadEventEnd - navigationEntries[0].loadEventStart;
            console.log(`ページ読み込み時間: ${loadTime}ms`);
        }
    }
});