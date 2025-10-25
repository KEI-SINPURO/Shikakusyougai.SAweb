// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeSliders();
    initializeYearlyActivity();
    initializeKeyboardNavigation();
    initializeSmoothScroll();
    initializeContactForm();
    initializeFAQ();
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

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// スライダー関連の初期化
function initializeSliders() {
    initializeMainSlider();
    initializeAboutImages();
}

// グローバル変数
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let autoSlideInterval;

// スライダーの状態を更新する関数
function updateSlider() {
    // 全てのスライドとインジケーターをリセット
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index < currentSlide) {
            slide.classList.add('prev');
        }
    });
    
    // インジケーターの更新
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// スライドを変更する関数
function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    updateSlider();
}

// 特定のスライドに移動する関数
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
}

// 自動スライド機能
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 4000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// 初期化関数
function initializeSlider() {
    // 初期状態の設定
    updateSlider();
    
    // 自動スライド開始
    startAutoSlide();
    
    // イベントリスナーの設定
    const sliderContainer = document.querySelector('.hero-slider');
    
    if (sliderContainer) {
        // マウスホバーで自動スライド停止/再開
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // キーボードナビゲーション
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // タッチスワイプ対応（モバイル用）
    if (sliderContainer) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // 左にスワイプ（次のスライド）
                    changeSlide(1);
                } else {
                    // 右にスワイプ（前のスライド）
                    changeSlide(-1);
                }
            }
        }
    }
}

// キーボードナビゲーション処理
function handleKeyboardNavigation(e) {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeSlide(1);
    } else if (e.key >= '1' && e.key <= '9') {
        const slideNumber = parseInt(e.key) - 1;
        if (slideNumber < totalSlides) {
            goToSlide(slideNumber);
        }
    }
}

// メインスライダー初期化
function initializeMainSlider() {
    // スライダー要素が存在するかチェック
    if (slides.length > 0) {
        initializeSlider();
    }
}

// ウィンドウがアンロードされる前にタイマーをクリア
window.addEventListener('beforeunload', () => {
    stopAutoSlide();
});

// 私達についての画像切り替え
function initializeAboutImages() {
    let aboutIndex = 0;
    const aboutImgs = document.querySelectorAll('.about-image');
    
    if (aboutImgs.length > 0) {
        setInterval(() => {
            aboutImgs.forEach(img => img.classList.remove('active'));
            aboutImgs[aboutIndex].classList.add('active');
            aboutIndex = (aboutIndex + 1) % aboutImgs.length;
        }, 2000);
        console.log('私達について画像切り替え開始');
    }
}

// 一年間の活動図の初期化
let activityCurrentImage = 0;
const activitySlides = document.querySelectorAll('.activity-slide');
let activityTimer;
let isFirstImage = true;
let activityStarted = false;

function showActivityImage() {
    // 要素が存在しない場合は終了
    if (activitySlides.length === 0) return;
    
    activitySlides.forEach(slide => slide.classList.remove('active'));
    if (activitySlides[activityCurrentImage]) {
        activitySlides[activityCurrentImage].classList.add('active');
    }
    
    console.log('活動図表示中:', activityCurrentImage);
}

function startActivityInterval() {
    if (activityStarted) return; // 重複実行を防ぐ
    activityStarted = true;
    
    activityTimer = setInterval(() => {
        activityCurrentImage++;
        if (activityCurrentImage >= activitySlides.length) {
            activityCurrentImage = 1; // 2枚目から再開
        }
        showActivityImage();
    }, 2000);
    
    console.log('活動図インターバル開始');
}

function initializeYearlyActivity() {
    const activitySection = document.getElementById('yearly');
    
    if (!activitySection || activitySlides.length === 0) {
        console.log('要素が見つかりません');
        return;
    }
    
    const activityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !activityStarted) {
                console.log('活動図セクション表示開始');
                
                // 最初の画像を表示
                activityCurrentImage = 0;
                showActivityImage();
                
                // 5秒後に2秒間隔の切り替えを開始
                setTimeout(() => {
                    startActivityInterval();
                }, 5000);
                
                activityObserver.unobserve(activitySection);
            }
        });
    }, { threshold: 0.3 });
    
    activityObserver.observe(activitySection);
}

// お問い合わせフォームの初期化（Formspree対応版）
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const messageDiv = document.getElementById('form-message');
    
    if (!form) return;
    
    // フォーム送信の処理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // バリデーションチェック
        if (validateForm()) {
            // Formspreeに送信
            submitToFormspree();
        }
    });
    
    // リアルタイムバリデーション
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Formspreeに送信する関数
function submitToFormspree() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    const messageDiv = document.getElementById('form-message');
    
    // ボタンを無効化
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">送信中...</span>';
    
    // FormDataを作成
    const formData = new FormData(form);
    
    // Formspreeに送信
    fetch('https://formspree.io/f/mdklyjgd', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // 成功メッセージを表示
            messageDiv.className = 'form-message success';
            messageDiv.textContent = 'お問い合わせを受け付けました。ありがとうございます！';
            messageDiv.style.display = 'block';
            
            // フォームをリセット
            form.reset();
            
            // ローカルストレージもクリア
            clearFormData();
            
        } else {
            throw new Error('送信に失敗しました');
        }
    })
    .catch(error => {
        // エラーメッセージを表示
        messageDiv.className = 'form-message error';
        messageDiv.textContent = '送信中にエラーが発生しました。しばらく後にもう一度お試しください。';
        messageDiv.style.display = 'block';
        console.error('送信エラー:', error);
    })
    .finally(() => {
        // ボタンを元に戻す
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">送信する</span><span class="btn-icon">→</span>';
        
        // メッセージを10秒後に非表示
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 10000);
        
        // メッセージ位置にスクロール
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// フォームバリデーション
function validateForm() {
    const form = document.getElementById('contactForm');
    let isValid = true;
    
    // 必須フィールドのチェック
    const requiredFields = [
        { id: 'name', message: 'お名前を入力してください' },
        { id: 'email', message: 'メールアドレスを入力してください' },
        { id: 'subject', message: '件名を選択してください' },
        { id: 'message', message: 'お問い合わせ内容を入力してください' },
        { id: 'privacy', message: 'プライバシーポリシーに同意してください' }
    ];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element) return;
        
        let value = element.value.trim();
        if (field.id === 'privacy') {
            value = element.checked;
        }
        
        if (!value) {
            showFieldError(element, field.message);
            isValid = false;
        }
    });
    
    // メールアドレスの形式チェック
    const emailField = document.getElementById('email');
    if (emailField && emailField.value.trim()) {
        if (!isValidEmail(emailField.value.trim())) {
            showFieldError(emailField, '正しいメールアドレスを入力してください');
            isValid = false;
        }
    }
    
    return isValid;
}

// 個別フィールドのバリデーション
function validateField(field) {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    
    // 必須フィールドのチェック
    if (field.hasAttribute('required') && !value) {
        const fieldName = field.previousElementSibling.textContent.replace(' *', '');
        showFieldError(field, `${fieldName}を入力してください`);
        return false;
    }
    
    // メールアドレスの形式チェック
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, '正しいメールアドレスを入力してください');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// メールアドレスの形式チェック
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// フィールドエラー表示
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorDiv);
}

// フィールドエラークリア
function clearFieldError(field) {
    field.style.borderColor = '#e1e8ed';
    field.style.boxShadow = 'none';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// FAQ機能の初期化
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // 他のFAQを閉じる
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // クリックされたFAQの状態を切り替え
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}

// アニメーション効果
function animateOnScroll() {
    const contactSection = document.getElementById('mail');
    if (!contactSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.info-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(contactSection);
}

// 電話番号やメールアドレスのクリック処理
function initializeContactLinks() {
    // 電話番号リンクの追加
    const phoneElements = document.querySelectorAll('.contact-detail strong');
    phoneElements.forEach(element => {
        if (element.textContent.includes('03-') || element.textContent.includes('0120-')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function() {
                window.location.href = `tel:${this.textContent.replace(/[^\d-]/g, '')}`;
            });
        }
    });
    
    // メールアドレスリンクの追加
    const emailElements = document.querySelectorAll('.contact-detail strong');
    emailElements.forEach(element => {
        if (element.textContent.includes('@')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function() {
                window.location.href = `mailto:${this.textContent}`;
            });
        }
    });
}

// フォームの入力値を保存（ローカルストレージ）
function saveFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.type !== 'checkbox') {
                localStorage.setItem(`contact_${this.name}`, this.value);
            }
        });
    });
}

// 保存されたフォームデータを復元
function restoreFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'checkbox') {
            const savedValue = localStorage.getItem(`contact_${input.name}`);
            if (savedValue) {
                input.value = savedValue;
            }
        }
    });
}

// フォーム送信後にローカルストレージをクリア
function clearFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        localStorage.removeItem(`contact_${input.name}`);
    });
}

// キーボードナビゲーション対応
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            changeSlide(1);
        }
    });
}

// スムーススクロール（古いブラウザ対応）
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 100;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
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

// ウィンドウリサイズ時の処理
window.addEventListener('resize', debounce(() => {
    // レスポンシブ対応の追加処理があればここに記述
}, 250));

// アクセシビリティ向上：フォーカス管理
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// スクロール位置に基づくナビゲーションハイライト
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// スクロールイベントリスナー（デバウンス付き）
window.addEventListener('scroll', debounce(highlightCurrentSection, 100));

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.log('エラーが発生しました:', e.error);
});

// 画像読み込みエラーの処理
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.log('画像の読み込みに失敗しました:', this.src);
        });
    });
});

// プリロード対応
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ページ読み込み完了後に画像をプリロード
window.addEventListener('load', preloadImages);

// 画像切り替え機能を強制的に開始（修正版）
window.addEventListener('load', function() {
    setTimeout(() => {
        // 一年間の活動図の切り替えを強制開始
        let activityIndex = 0;
        const activitySlides = document.querySelectorAll('.activity-slide');
        
        if (activitySlides.length > 0) {
            // 最初のスライドを表示
            activitySlides.forEach(slide => slide.classList.remove('active'));
            activitySlides[0].classList.add('active');
            
            // 5秒後に2秒間隔で切り替え開始
            setTimeout(() => {
                setInterval(() => {
                    activitySlides.forEach(slide => slide.classList.remove('active'));
                    activityIndex = (activityIndex + 1) % activitySlides.length;
                    activitySlides[activityIndex].classList.add('active');
                }, 2000);
            }, 5000);
        }
        
        // 私達についての画像切り替えを強制開始
        let aboutIndex = 0;
        const aboutImages = document.querySelectorAll('.about-image');
        
        if (aboutImages.length > 0) {
            setInterval(() => {
                aboutImages.forEach(img => img.classList.remove('active'));
                aboutImages[aboutIndex].classList.add('active');
                aboutIndex = (aboutIndex + 1) % aboutImages.length;
            }, 2000);
        }
        
    }, 2000); // 2秒後に開始
    
    // 追加の初期化関数を呼び出し
    animateOnScroll();
    initializeContactLinks();
    saveFormData();
    restoreFormData();
});