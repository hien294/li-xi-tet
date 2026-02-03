document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const nameModal = document.getElementById("name-modal");
    const welcomeSection = document.getElementById("welcome-section");
    const senderNameInput = document.getElementById("sender-name");
    const confirmNameBtn = document.getElementById("confirm-name-btn");
    const minimizeNameBtn = document.getElementById("minimize-name-btn");
    const nameMinimized = document.getElementById("name-minimized");
    const nameExpanded = document.getElementById("name-expanded");
    const minimizedNameDisplay = document.getElementById("minimized-name-display");

    const relationshipSelection = document.getElementById("relationship-selection");
    const relationshipGrid = relationshipSelection?.querySelector(".grid");
    const ageSelection = document.getElementById("age-selection");
    const ageGrid = ageSelection?.querySelector(".grid");
    const hongbaoSelection = document.getElementById("hongbao-selection");
    const hongbaoGrid = document.getElementById("hongbao-grid");

    const resultModal = document.getElementById("result-modal");
    const modalOverlay = document.getElementById("modal-overlay");
    const diceSection = document.getElementById("dice-section");
    const letterScratchSection = document.getElementById("letter-scratch-section");

    const dice1 = document.getElementById("dice1");
    const dice2 = document.getElementById("dice2");
    const dice3 = document.getElementById("dice3");

    const letterDate = document.getElementById("letter-date");
    const letterContent = document.getElementById("letter-content");
    const letterClosing = document.getElementById("letter-closing");
    const signatureName = document.getElementById("signature-name");
    const moneyAmount = document.getElementById("money-amount");
    const closeModalBtn = document.getElementById("close-modal");

    const step1Dot = document.getElementById("step1-dot");
    const step2Dot = document.getElementById("step2-dot");
    const step3Dot = document.getElementById("step3-dot");
    const step4Dot = document.getElementById("step4-dot");

    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings');

    // Variables
    let senderName = "";
    let selectedRelationship = null;
    let selectedAge = null;
    let selectedHongbao = null;
    let isRolling = false;
    let isScratching = false;
    let ctx = null;
    let scratchCanvas = null;
    let currentAmount = 0;
    let selectedRelationshipId = "";
    let selectedAgeId = "";
    let scratchPoints = [];

    // Relationships (đã thêm needsAge)
    const relationships = [
        { id: "grandparents", name: "Ông Bà", icon: "fa-solid fa-person-cane", formal: "Kính gửi Ông Bà", needsAge: false },
        { id: "parents", name: "Bố Mẹ", icon: "fa-solid fa-house-user", formal: "Kính gửi Bố Mẹ", needsAge: false },
        { id: "children", name: "Con Cái", icon: "fa-solid fa-children", formal: "Gửi các con yêu", needsAge: true },
        { id: "siblings", name: "Anh Chị Em", icon: "fa-solid fa-people-group", formal: "Gửi anh/chị/em", needsAge: true },
        { id: "aunt_uncle", name: "Cô Dì Chú Bác", icon: "fa-solid fa-people-roof", formal: "Kính gửi Cô/Dì/Chú/Bác", needsAge: false },
        { id: "friends", name: "Bạn Bè", icon: "fa-solid fa-user-group", formal: "Gửi bạn thân", needsAge: true },
        { id: "colleagues", name: "Đồng Nghiệp", icon: "fa-solid fa-handshake", formal: "Gửi đồng nghiệp", needsAge: true },
        { id: "lovers", name: "Người Yêu", icon: "fa-solid fa-heart-circle-plus", formal: "Gửi người yêu dấu", needsAge: false }
    ];

    // Age groups (chỉ giữ 4 nhóm)
    const ageGroups = [
        { id: "child", name: "Trẻ Em", range: "1-12 tuổi", icon: "fa-solid fa-child-reaching" },
        { id: "teen", name: "Thiếu Niên", range: "13-17 tuổi", icon: "fa-solid fa-graduation-cap" },
        { id: "young_adult", name: "Thanh Niên", range: "18-25 tuổi", icon: "fa-solid fa-person-running" },
        { id: "adult", name: "Trưởng Thành", range: "26-40 tuổi", icon: "fa-solid fa-user-tie" }
    ];

    // Money Messages
    const moneyMessages = [
        "Chúc bạn một năm thịnh vượng!",
        "Tài lộc dồi dào quanh năm!",
        "Phúc khí tràn đầy, may mắn không ngừng!",
        "Lộc xuân về nhà, phúc đến cửa!",
        "Một năm mới an khang và thành công!",
        "Vạn sự như Ý, trăm sự cát tường!",
        "Xuân an vui, Tết hạnh phúc!",
        "Cung chúc tân xuân phước vĩnh cửu!",
        "Phát tài phát lộc năm mới!",
        "Tiền vào như nước, tài lộc đầy nhà!"
    ];

    // Letter closings
    const letterClosings = {
        grandparents: "Kính chúc Ông Bà",
        parents: "Kính chúc Bố Mẹ",
        children: "Thương yêu",
        siblings: "Thân ái",
        aunt_uncle: "Kính chúc",
        friends: "Thân mến",
        colleagues: "Trân trọng",
        lovers: "Yêu thương"
    };

    // Letter Templates (giữ nguyên toàn bộ nội dung dài của bạn)
    const letterTemplates = {
        grandparents: [
            `Xuân mới lại về, mang theo bao niềm vui và hy vọng. Nhân dịp năm mới, cháu xin gửi đến Ông Bà lời chúc sức khỏe, an khang và thịnh vượng.<br><br>Chúc Ông Bà luôn dồi dào sức khỏe, tinh thần minh mẫn, và tràn đầy niềm vui trong cuộc sống. Mong rằng năm mới sẽ mang đến nhiều may mắn, thành công và hạnh phúc cho Ông Bà.<br><br>Dù không gian có cách trở nhưng tấm lòng và tình cảm luôn hướng về Ông Bà. Những lời dạy bảo của Ông Bà là kim chỉ nam quý giá nhất cho cháu trong cuộc đời.`
        ],
        parents: [
            `Gửi Bố Mẹ yêu quý,<br><br>Xuân mới lại về, con xin gửi đến Bố Mẹ những lời chúc tốt đẹp nhất. Chúc Bố Mẹ năm mới thật nhiều sức khỏe, luôn vui vẻ và hạnh phúc.<br><br>Cảm ơn Bố Mẹ đã luôn yêu thương, chăm sóc và dạy dỗ con nên người. Con yêu Bố Mẹ rất nhiều!`
        ],
        children: [
            `Gửi các con yêu quý,<br><br>Năm mới đến, ba/mẹ gửi đến các con lời chúc tốt đẹp nhất. Chúc các con luôn khỏe mạnh, vui vẻ và học hành chăm ngoan.<br><br>Ba/mẹ rất tự hào về các con. Chúc các con năm mới nhiều niềm vui!`
        ],
        siblings: [
            `Gửi anh/chị/em thân yêu,<br><br>Xuân về với muôn vàn niềm vui, anh/chị/em gửi lời chúc năm mới an khang, thịnh vượng. Chúc mình luôn khỏe mạnh, thành công trong công việc và hạnh phúc trong cuộc sống.`
        ],
        friends: [
            `Gửi bạn thân yêu,<br><br>Năm mới đến rồi! Chúc bạn một năm tràn đầy sức khỏe, thành công và hạnh phúc. Tình bạn của chúng ta là món quà quý giá mà mình trân trọng nhất.`
        ],
        colleagues: [
            `Gửi đồng nghiệp thân mến,<br><br>Nhân dịp năm mới, xin chúc anh/chị/bạn sức khỏe dồi dào, công việc thăng tiến, gia đình hạnh phúc. Chúc mừng năm mới!`
        ],
        aunt_uncle: [
            `Kính gửi Cô/Dì/Chú/Bác,<br><br>Xuân về, cháu xin kính chúc Cô/Dì/Chú/Bác sức khỏe dồi dào, gia đình hạnh phúc, công việc thuận lợi. Chúc cả gia đình luôn sum vầy, hạnh phúc!`
        ],
        lovers: [
            `Gửi người yêu dấu,<br><br>Xuân về, anh/em xin gửi đến em/anh lời chúc ngọt ngào nhất. Chúc chúng ta một năm mới tràn đầy hạnh phúc, tình yêu thắm thiết. Anh/em yêu em/anh rất nhiều!`
        ]
    };

    // ========== LOCALSTORAGE ==========
    function loadSavedName() {
        const saved = localStorage.getItem('lixi_sender_name');
        if (saved) {
            senderName = saved;
            if (minimizedNameDisplay) minimizedNameDisplay.textContent = saved;
            return true;
        }
        return false;
    }

    function saveName(name) {
        localStorage.setItem('lixi_sender_name', name);
        senderName = name;
    }

    function loadAmountRanges() {
        const defaults = {
            grandparents: { min: 50000, max: 500000 },
            parents: { min: 50000, max: 500000 },
            lovers: { min: 50000, max: 500000 },
            others: { min: 10000, max: 500000 }
        };
        try {
            const saved = JSON.parse(localStorage.getItem('lixi_amount_ranges') || '{}');
            return {
                grandparents: { ...defaults.grandparents, ...saved.grandparents },
                parents: { ...defaults.parents, ...saved.parents },
                lovers: { ...defaults.lovers, ...saved.lovers },
                others: { ...defaults.others, ...saved.others }
            };
        } catch (e) {
            return defaults;
        }
    }

    let amountRanges = loadAmountRanges();

    // Format currency
    function formatCurrency(amount) {
        return amount.toLocaleString("vi-VN") + " ₫";
    }

    // ========== SETTINGS LOGIC (min & max) ==========
    function updateSettingsUI() {
        ['grandparents', 'parents', 'lovers', 'others'].forEach(group => {
            document.getElementById(`min-${group}`).value = amountRanges[group].min;
            document.getElementById(`max-${group}`).value = amountRanges[group].max;
            document.getElementById(`display-min-${group}`).textContent = formatCurrency(amountRanges[group].min);
            document.getElementById(`display-${group}`).textContent = formatCurrency(amountRanges[group].max);
        });
    }

    document.querySelectorAll('#settings-modal input[type="range"]').forEach(slider => {
        slider.addEventListener('input', () => {
            const [type, group] = slider.id.split('-');
            const displayId = type === 'min' ? `display-min-${group}` : `display-${group}`;
            document.getElementById(displayId).textContent = formatCurrency(Number(slider.value));

            if (type === 'min') {
                const maxEl = document.getElementById(`max-${group}`);
                if (Number(slider.value) > Number(maxEl.value)) {
                    maxEl.value = slider.value;
                    document.getElementById(`display-${group}`).textContent = formatCurrency(Number(maxEl.value));
                }
            }
            if (type === 'max') {
                const minEl = document.getElementById(`min-${group}`);
                if (Number(slider.value) < Number(minEl.value)) {
                    minEl.value = slider.value;
                    document.getElementById(`display-min-${group}`).textContent = formatCurrency(Number(minEl.value));
                }
            }
        });
    });

    settingsBtn?.addEventListener('click', () => {
        updateSettingsUI();
        settingsModal?.classList.remove('hidden');
    });

    closeSettings?.addEventListener('click', () => settingsModal?.classList.add('hidden'));
    settingsModal?.addEventListener('click', e => {
        if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });

    saveSettingsBtn?.addEventListener('click', () => {
        ['grandparents', 'parents', 'lovers', 'others'].forEach(group => {
            amountRanges[group] = {
                min: Number(document.getElementById(`min-${group}`).value),
                max: Number(document.getElementById(`max-${group}`).value)
            };
        });
        localStorage.setItem('lixi_amount_ranges', JSON.stringify(amountRanges));
        settingsModal?.classList.add('hidden');
    });

    // ========== NAME & INITIALIZATION (giữ nguyên) ==========
    const hasName = loadSavedName();
    if (hasName) {
        nameExpanded.classList.add("hidden");
        nameMinimized.classList.remove("hidden");
        welcomeSection.classList.add("hidden");
        initRelationshipSelection();
        relationshipSelection.classList.remove("hidden");
        updateStepIndicator(2);
    } else {
        nameExpanded.classList.remove("hidden");
        nameMinimized.classList.add("hidden");
        setTimeout(() => {
            if (senderNameInput) senderNameInput.focus();
        }, 500);
    }

    // Các event name (giữ nguyên)
    if (senderNameInput) {
        senderNameInput.addEventListener("input", function () {
            if (confirmNameBtn) confirmNameBtn.disabled = this.value.trim().length === 0;
        });

        senderNameInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter" && this.value.trim().length > 0) confirmNameBtn.click();
        });
    }

    minimizeNameBtn?.addEventListener("click", () => {
        nameExpanded.classList.add("hidden");
        nameMinimized.classList.remove("hidden");
    });

    nameMinimized?.addEventListener("click", () => {
        senderNameInput.value = senderName;
        nameExpanded.classList.remove("hidden");
        nameMinimized.classList.add("hidden");
        setTimeout(() => {
            senderNameInput.focus();
            senderNameInput.select();
        }, 100);
    });

    confirmNameBtn?.addEventListener("click", () => {
        const name = senderNameInput.value.trim();
        if (name) {
            saveName(name);
            minimizedNameDisplay.textContent = name;
            hideNameModal();
        }
    });

    function hideNameModal() {
        nameModal.classList.add("animate-slideOutLeft");
        setTimeout(() => {
            nameExpanded.classList.add("hidden");
            nameMinimized.classList.remove("hidden");
            nameModal.classList.remove("animate-slideOutLeft");
        }, 300);

        updateStepIndicator(2);
        setTimeout(() => {
            welcomeSection.classList.add("hidden");
            initRelationshipSelection();
            relationshipSelection.classList.remove("hidden");
            relationshipSelection.scrollIntoView({ behavior: "smooth" });
        }, 300);
    }

    // Step Indicator (giữ nguyên)
    function updateStepIndicator(currentStep) {
        [step1Dot, step2Dot, step3Dot, step4Dot].forEach(dot => {
            dot.classList.remove("completed", "active");
        });

        if (currentStep === 1) step1Dot?.classList.add("active");
        if (currentStep === 2) {
            step1Dot?.classList.add("completed");
            step2Dot?.classList.add("active");
        }
        if (currentStep === 3) {
            step1Dot?.classList.add("completed");
            step2Dot?.classList.add("completed");
            step3Dot?.classList.add("active");
        }
        if (currentStep === 4) {
            step1Dot?.classList.add("completed");
            step2Dot?.classList.add("completed");
            step3Dot?.classList.add("completed");
            step4Dot?.classList.add("active");
        }
    }

    // ========== RELATIONSHIP SELECTION (đã sửa logic needsAge) ==========
    function initRelationshipSelection() {
        if (!relationshipGrid) return;
        relationshipGrid.innerHTML = "";

        relationships.forEach((relationship) => {
            const card = document.createElement("div");
            card.className = "selection-card rounded-xl p-4 text-center cursor-pointer h-full";
            card.dataset.relationship = relationship.id;
            card.innerHTML = `
                <div class="text-3xl text-amber-300 mb-3"><i class="${relationship.icon}"></i></div>
                <div class="text-lg font-bold text-white mb-1">${relationship.name}</div>
                <div class="text-amber-200 text-sm">${relationship.formal}</div>
            `;

            card.addEventListener("click", function () {
                if (selectedRelationship === this) return;

                document.querySelectorAll("#relationship-selection .selection-card").forEach((c) => {
                    c.classList.remove("selected");
                });

                selectedRelationship = this;
                selectedRelationshipId = relationship.id;
                this.classList.add("selected");

                if (!relationship.needsAge) {
                    updateStepIndicator(4);
                    setTimeout(() => {
                        createHongbaos();
                        if (hongbaoSelection) hongbaoSelection.classList.remove("hidden");
                        if (ageSelection) ageSelection.classList.add("hidden");
                        if (hongbaoSelection) hongbaoSelection.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                } else {
                    updateStepIndicator(3);
                    setTimeout(() => {
                        initAgeSelection();
                        if (ageSelection) ageSelection.classList.remove("hidden");
                        if (hongbaoSelection) hongbaoSelection.classList.add("hidden");
                        if (ageSelection) ageSelection.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                }
            });

            relationshipGrid.appendChild(card);
        });
    }

    // ========== AGE SELECTION (chỉ 4 nhóm) ==========
    function initAgeSelection() {
        if (!ageGrid) return;
        ageGrid.innerHTML = "";

        ageGroups.forEach((age) => {
            const card = document.createElement("div");
            card.className = "selection-card rounded-xl p-4 text-center cursor-pointer h-full";
            card.dataset.age = age.id;
            card.innerHTML = `
                <div class="text-3xl text-amber-300 mb-3"><i class="${age.icon}"></i></div>
                <div class="text-lg font-bold text-white mb-1">${age.name}</div>
                <div class="text-amber-200 text-sm">${age.range}</div>
            `;

            card.addEventListener("click", function () {
                if (selectedAge === this) return;

                document.querySelectorAll("#age-selection .selection-card").forEach((c) => {
                    c.classList.remove("selected");
                });

                selectedAge = this;
                selectedAgeId = age.id;
                this.classList.add("selected");

                updateStepIndicator(4);
                setTimeout(() => {
                    createHongbaos();
                    if (hongbaoSelection) hongbaoSelection.classList.remove("hidden");
                    if (hongbaoSelection) hongbaoSelection.scrollIntoView({ behavior: "smooth" });
                }, 300);
            });

            ageGrid.appendChild(card);
        });
    }

    // ========== RANDOM AMOUNT (dùng min-max) ==========
    function getRandomAmount() {
        let range;
        if (["grandparents", "parents"].includes(selectedRelationshipId)) {
            range = amountRanges.grandparents;
        } else if (selectedRelationshipId === "lovers") {
            range = amountRanges.lovers;
        } else {
            range = amountRanges.others;
        }

        const min = range.min;
        const max = range.max;
        if (min >= max) return min;

        let amount = min + Math.random() * (max - min);
        amount = Math.round(amount / 5000) * 5000;
        return Math.max(min, Math.min(max, amount));
    }

    // ========== CREATE HONGBAOS (giữ nguyên) ==========
    function createHongbaos() {
        if (!hongbaoGrid) return;
        hongbaoGrid.innerHTML = "";

        const colorVariants = [
            "from-red-600 to-red-800", "from-red-700 to-red-900", "from-amber-600 to-amber-800",
            "from-red-800 to-red-950", "from-amber-700 to-amber-900", "from-red-900 to-amber-900",
            "from-amber-800 to-red-900", "from-red-700 to-amber-800", "from-amber-900 to-red-800",
            "from-red-800 to-amber-700", "from-amber-800 to-red-950", "from-red-950 to-amber-800",
            "from-amber-900 to-red-700", "from-red-900 to-amber-950", "from-red-600 to-amber-700",
            "from-amber-700 to-red-800", "from-red-800 to-amber-800", "from-amber-800 to-red-700",
            "from-red-700 to-amber-900", "from-amber-900 to-red-600", "from-red-900 to-amber-700",
            "from-amber-700 to-red-900", "from-red-600 to-amber-800", "from-amber-800 to-red-600"
        ];

        for (let i = 1; i <= 24; i++) {
            const colorClass = colorVariants[i - 1];
            const hongbaoItem = document.createElement("div");
            hongbaoItem.className = `hongbao-card rounded-lg flex flex-col cursor-pointer h-40 md:h-48`;
            hongbaoItem.dataset.id = i;

            hongbaoItem.innerHTML = `
                <div class="hongbao-top h-8 md:h-10 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    <div class="text-red-900 font-bold text-sm md:text-base tracking-wider relative z-10">LỘC</div>
                </div>
                <div class="flex-grow bg-gradient-to-br ${colorClass} rounded-b-lg p-3 flex flex-col items-center justify-center relative">
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 hongbao-number w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg">${i}</div>
                    <div class="text-amber-200 text-lg font-bold mb-1 font-playfair">BAO</div>
                    <div class="text-amber-300 text-2xl md:text-3xl font-bold font-dancing">${String(i).padStart(2, "0")}</div>
                    <div class="text-amber-100/80 text-xs mt-1">Nhấn chọn</div>
                    <div class="absolute bottom-1 left-1 text-amber-300/20">
                        <i class="fas fa-circle text-[6px]"></i>
                        <i class="fas fa-circle text-[6px] ml-[2px]"></i>
                    </div>
                    <div class="absolute bottom-1 right-1 text-amber-300/20">
                        <i class="fas fa-circle text-[6px]"></i>
                        <i class="fas fa-circle text-[6px] ml-[2px]"></i>
                    </div>
                </div>
            `;

            hongbaoItem.addEventListener("click", function () {
                if (selectedHongbao === this || isRolling) return;

                document.querySelectorAll(".hongbao-card").forEach((item) => {
                    item.classList.remove("selected");
                });

                selectedHongbao = this;
                this.classList.add("selected");

                setTimeout(() => {
                    showResultModal(i);
                }, 500);
            });

            hongbaoGrid.appendChild(hongbaoItem);
        }
    }

    // ========== RESULT & DICE (giữ nguyên) ==========
    function showResultModal(selectedId) {
        if (diceSection) diceSection.classList.remove("hidden");
        if (letterScratchSection) letterScratchSection.classList.add("hidden");
        if (resultModal) resultModal.classList.remove("hidden");
        if (modalOverlay) modalOverlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        startDiceRolling(selectedId);
    }

    function startDiceRolling(selectedId) {
        isRolling = true;
        if (dice1) dice1.classList.add("rolling");
        if (dice2) dice2.classList.add("rolling");
        if (dice3) dice3.classList.add("rolling");

        currentAmount = getRandomAmount();
        const letter = generateLetter();
        const message = moneyMessages[Math.floor(Math.random() * moneyMessages.length)];

        setTimeout(() => {
            stopDiceRolling();
            isRolling = false;
            setTimeout(() => {
                showLetterAndScratch(letter, currentAmount, message);
            }, 1000);
        }, 3000);
    }

    function generateLetter() {
        const today = new Date();
        const dateStr = today.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const relationship = relationships.find((r) => r.id === selectedRelationshipId);
        const templates = letterTemplates[selectedRelationshipId] || letterTemplates.friends;
        const content = templates[Math.floor(Math.random() * templates.length)];

        return {
            date: `Ngày ${dateStr}`,
            greeting: `${relationship.formal},`,
            content: content,
            closing: letterClosings[selectedRelationshipId]
        };
    }

    function stopDiceRolling() {
        if (dice1) dice1.classList.remove("rolling");
        if (dice2) dice2.classList.remove("rolling");
        if (dice3) dice3.classList.remove("rolling");

        const diceValues = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];

        const rotations = [
            { x: diceValues[0] * 60, y: diceValues[0] * 60 },
            { x: diceValues[1] * 60, y: diceValues[1] * 60 },
            { x: diceValues[2] * 60, y: diceValues[2] * 60 }
        ];

        if (dice1) dice1.style.transform = `rotateX(${rotations[0].x}deg) rotateY(${rotations[0].y}deg)`;
        if (dice2) dice2.style.transform = `rotateX(${rotations[1].x}deg) rotateY(${rotations[1].y}deg)`;
        if (dice3) dice3.style.transform = `rotateX(${rotations[2].x}deg) rotateY(${rotations[2].y}deg)`;
    }

    function showLetterAndScratch(letter, amount, message) {
        if (diceSection) diceSection.classList.add("hidden");
        if (letterScratchSection) letterScratchSection.classList.remove("hidden");
        if (letterDate) letterDate.textContent = letter.date;
        if (letterContent) letterContent.innerHTML = letter.content;
        if (letterClosing) letterClosing.textContent = letter.closing;
        if (signatureName) signatureName.textContent = senderName;
        if (moneyAmount) moneyAmount.textContent = formatCurrency(amount);
        initScratchCard();
    }

    // ========== SCRATCH CARD (giữ nguyên) ==========
    function initScratchCard() {
        const container = document.querySelector('.scratch-card-container');
        if (!container) return;

        const oldCanvas = document.getElementById("scratch-canvas");
        if (oldCanvas) oldCanvas.remove();

        scratchCanvas = document.createElement("canvas");
        scratchCanvas.id = "scratch-canvas";
        scratchCanvas.className = "scratch-canvas";
        container.appendChild(scratchCanvas);

        scratchCanvas.width = container.offsetWidth;
        scratchCanvas.height = container.offsetHeight;
        ctx = scratchCanvas.getContext("2d", { willReadFrequently: true });

        ctx.fillStyle = "#E0E0E0";
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        ctx.fillStyle = "#FFFFFF";
        for (let x = 10; x < scratchCanvas.width; x += 25) {
            for (let y = 10; y < scratchCanvas.height; y += 25) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const gradient = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        ctx.fillStyle = "#8B4513";
        ctx.font = "bold 18px 'Noto Serif', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Đón nhận may mắn đầu năm.", scratchCanvas.width / 2, scratchCanvas.height / 2);

        scratchCanvas.addEventListener("mousedown", handleMouseDown);
        scratchCanvas.addEventListener("mousemove", handleMouseMove);
        scratchCanvas.addEventListener("mouseup", handleMouseUp);
        scratchCanvas.addEventListener("touchstart", handleTouchStart, { passive: false });
        scratchCanvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        scratchCanvas.addEventListener("touchend", handleTouchEnd);

        scratchPoints = [];
    }

    function handleMouseDown(e) {
        isScratching = true;
        scratchPoints = [];
        const rect = scratchCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        scratchPoints.push({ x, y });
        scratch(x, y);
    }

    function handleMouseMove(e) {
        if (!isScratching) return;
        const rect = scratchCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (scratchPoints.length > 0) {
            const lastPoint = scratchPoints[scratchPoints.length - 1];
            interpolatePoints(lastPoint.x, lastPoint.y, x, y);
        }

        scratchPoints.push({ x, y });
        scratch(x, y);
    }

    function handleMouseUp() {
        isScratching = false;
        scratchPoints = [];
    }

    function handleTouchStart(e) {
        e.preventDefault();
        isScratching = true;
        scratchPoints = [];
        const touch = e.touches[0];
        const rect = scratchCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        scratchPoints.push({ x, y });
        scratch(x, y);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (!isScratching || !e.touches.length) return;
        const touch = e.touches[0];
        const rect = scratchCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (scratchPoints.length > 0) {
            const lastPoint = scratchPoints[scratchPoints.length - 1];
            interpolatePoints(lastPoint.x, lastPoint.y, x, y);
        }

        scratchPoints.push({ x, y });
        scratch(x, y);
    }

    function handleTouchEnd() {
        isScratching = false;
        scratchPoints = [];
    }

    function interpolatePoints(x1, y1, x2, y2) {
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const steps = Math.ceil(distance / 5);

        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            scratch(x, y, true);
        }
    }

    function scratch(clientX, clientY, skipCheck = false) {
        if (!ctx || !scratchCanvas) return;

        const x = clientX;
        const y = clientY;
        const clampedX = Math.max(0, Math.min(x, scratchCanvas.width));
        const clampedY = Math.max(0, Math.min(y, scratchCanvas.height));

        ctx.globalCompositeOperation = "destination-out";

        const radius = 30;
        const gradient = ctx.createRadialGradient(clampedX, clampedY, 0, clampedX, clampedY, radius);
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(0.7, "rgba(0,0,0,0.9)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.arc(clampedX, clampedY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // ========== CLOSE MODAL (đã sửa để không reset) ==========
    function closeModal() {
        if (resultModal) resultModal.classList.add("hidden");
        if (modalOverlay) modalOverlay.classList.add("hidden");
        document.body.style.overflow = "auto";

        if (dice1) dice1.style.transform = "";
        if (dice2) dice2.style.transform = "";
        if (dice3) dice3.style.transform = "";

        if (selectedHongbao) {
            selectedHongbao.classList.remove("selected");
            selectedHongbao = null;
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay && !resultModal.classList.contains("hidden")) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !resultModal.classList.contains("hidden")) {
            closeModal();
        }
    });
});