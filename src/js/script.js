document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const nameModal = document.getElementById("name-modal");
  const welcomeSection = document.getElementById("welcome-section");
  const senderNameInput = document.getElementById("sender-name");
  const confirmNameBtn = document.getElementById("confirm-name-btn");
  const minimizeNameBtn = document.getElementById("minimize-name-btn");
  const nameMinimized = document.getElementById("name-minimized");
  const nameExpanded = document.getElementById("name-expanded");
  const minimizedNameDisplay = document.getElementById(
    "minimized-name-display",
  );

  const relationshipSelection = document.getElementById(
    "relationship-selection",
  );
  const relationshipGrid = relationshipSelection?.querySelector(".grid");
  const hongbaoSelection = document.getElementById("hongbao-selection");
  const hongbaoGrid = document.getElementById("hongbao-grid");

  const resultModal = document.getElementById("result-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const diceLoadingModal = document.getElementById("dice-loading-modal");
  const letterScratchSection = document.getElementById(
    "letter-scratch-section",
  );

  const dice1Loading = document.getElementById("dice1-loading");
  const dice2Loading = document.getElementById("dice2-loading");
  const dice3Loading = document.getElementById("dice3-loading");

  const letterDate = document.getElementById("letter-date");
  const letterContent = document.getElementById("letter-content");
  const letterClosing = document.getElementById("letter-closing");
  const signatureName = document.getElementById("signature-name");
  const moneyAmount = document.getElementById("money-amount");
  const closeModalBtn = document.getElementById("close-modal");

  const step1Dot = document.getElementById("step1-dot");
  const step2Dot = document.getElementById("step2-dot");
  const step3Dot = document.getElementById("step3-dot");

  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettings = document.getElementById("close-settings");
  const saveSettingsBtn = document.getElementById("save-settings");

  // Variables
  let senderName = "";
  let selectedRelationship = null;
  let selectedHongbao = null;
  let isRolling = false;
  let isScratching = false;
  let ctx = null;
  let scratchCanvas = null;
  let currentAmount = 0;
  let selectedRelationshipId = "";
  let scratchPoints = [];

  // Relationships
  const relationships = [
    {
      id: "grandparents",
      name: "Ông Bà",
      icon: "fa-solid fa-person-cane",
      formal: "Kính gửi Ông Bà",
      needsAge: false,
    },
    {
      id: "parents",
      name: "Bố Mẹ",
      icon: "fa-solid fa-house-user",
      formal: "Kính gửi Bố Mẹ",
      needsAge: false,
    },
    {
      id: "children",
      name: "Con Cái",
      icon: "fa-solid fa-children",
      formal: "Gửi các con yêu",
      needsAge: false, // CHANGED: không cần chọn độ tuổi nữa
    },
    {
      id: "siblings",
      name: "Anh Chị Em",
      icon: "fa-solid fa-people-group",
      formal: "Gửi anh/chị/em",
      needsAge: false, // CHANGED
    },
    {
      id: "aunt_uncle",
      name: "Cô Dì Chú Bác",
      icon: "fa-solid fa-people-roof",
      formal: "Kính gửi Cô/Dì/Chú/Bác",
      needsAge: false,
    },
    {
      id: "friends",
      name: "Bạn Bè",
      icon: "fa-solid fa-user-group",
      formal: "Gửi bạn thân",
      needsAge: false, // CHANGED
    },
    {
      id: "colleagues",
      name: "Đồng Nghiệp",
      icon: "fa-solid fa-handshake",
      formal: "Gửi đồng nghiệp",
      needsAge: false, // CHANGED
    },
    {
      id: "lovers",
      name: "Người Yêu",
      icon: "fa-solid fa-heart-circle-plus",
      formal: "Gửi người yêu dấu",
      needsAge: false,
    },
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
    "Tiền vào như nước, tài lộc đầy nhà!",
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
    lovers: "Yêu thương",
  };

  // Letter Templates
  const letterTemplates = {
    grandparents: [
      `Xuân mới lại về, mang theo sắc hoa rực rỡ, hơi ấm của đất trời và bao điều tốt lành.<br>
            Trong khoảnh khắc thiêng liêng của năm mới, cháu xin kính gửi đến Ông Bà những lời chúc yêu thương và trân trọng nhất.<br><br>
            Cháu kính chúc Ông Bà luôn dồi dào sức khỏe, thân tâm an lạc, tinh thần minh mẫn và lúc nào cũng vui vẻ, an nhiên.<br>
            Mong rằng mỗi ngày trôi qua đều nhẹ nhàng, bình yên, tràn đầy tiếng cười và sự ấm áp bên con cháu trong gia đình.<br><br>
            Cháu cầu chúc năm mới sẽ mang đến cho Ông Bà thật nhiều may mắn, an khang và thịnh vượng.<br>
            Mọi điều trong cuộc sống đều hanh thông, suôn sẻ, niềm vui luôn đầy ắp trong từng khoảnh khắc thường ngày.<br><br>
            Xuân này và thật nhiều mùa xuân về sau nữa,<br>
            mong Ông Bà luôn mạnh khỏe, sống lâu, sống vui,<br>
            là chỗ dựa yêu thương và là niềm tự hào lớn nhất của con cháu trong gia đình.`,

      `Kính gửi Ông Bà kính yêu,<br><br>
            Năm mới lại đến, mang theo niềm vui sum vầy và bao điều tốt đẹp.<br>
            Nhân dịp đầu xuân năm mới, cháu xin kính chúc Ông Bà luôn dồi dào sức khỏe, ăn ngon miệng, ngủ ngon giấc, tinh thần luôn thoải mái và vui vẻ mỗi ngày.<br><br>
            Cháu xin chân thành cảm ơn Ông Bà vì suốt những năm tháng qua đã luôn yêu thương, che chở và hy sinh thầm lặng cho cháu.<br>
            Những lời dạy bảo ân cần, những tình cảm giản dị mà sâu sắc của Ông Bà chính là hành trang quý giá nhất theo cháu suốt cuộc đời.<br><br>
            Bước sang năm mới, cháu mong Ông Bà luôn an yên, mạnh khỏe và hạnh phúc,<br>
            luôn được quây quần bên con cháu trong không khí ấm áp, yêu thương của gia đình.<br>
            Cháu kính chúc Ông Bà một năm mới an khang, vạn sự như ý và thật nhiều niềm vui.`,

      `Thưa Ông Bà,<br><br>
            Nhân dịp năm mới, cháu xin kính chúc Ông Bà luôn được bình an, dồi dào sức khỏe và vạn sự như ý.<br>
            Mong rằng từng ngày trôi qua đều nhẹ nhàng, an nhiên, để Ông Bà được tận hưởng trọn vẹn những niềm vui giản dị, ấm áp bên gia đình và con cháu.<br><br>
            Cháu luôn ghi nhớ và trân trọng những yêu thương, dạy bảo mà Ông Bà đã dành cho cháu suốt thời gian qua.<br>
            Được làm cháu của Ông Bà là niềm hạnh phúc và tự hào lớn nhất trong cuộc đời cháu.<br><br>
            Bước sang năm mới, cháu kính mong Ông Bà luôn mạnh khỏe, tinh thần minh mẫn,<br>
            cuộc sống lúc nào cũng tràn đầy niềm vui, tiếng cười và sự yêu thương.`,
    ],

    parents: [
      `Gửi Bố Mẹ yêu quý,<br><br>
            Xuân mới lại về trong không khí ấm áp và sum vầy, con xin gửi đến Bố Mẹ những lời chúc tốt đẹp và chân thành nhất từ tận đáy lòng.<br>
            Con chúc Bố Mẹ năm mới thật nhiều sức khỏe, tinh thần luôn vui vẻ, an yên và hạnh phúc mỗi ngày.<br><br>
            Mong rằng dù cuộc sống có bận rộn đến đâu, Bố Mẹ vẫn luôn cảm nhận được tình yêu thương và sự quan tâm của con.<br>
            Con yêu Bố Mẹ rất nhiều và luôn mong được ở bên chăm sóc Bố Mẹ thật lâu dài.`,

      `Bố Mẹ ơi,<br><br>
            Năm mới đến rồi, con mong rằng mọi điều tốt đẹp nhất sẽ luôn ở bên Bố Mẹ trong suốt cả năm nay.<br>
            Con chúc Bố Mẹ luôn khỏe mạnh, công việc hanh thông, mọi dự định đều thuận lợi và suôn sẻ.<br><br>
            Gia đình mình lúc nào cũng ấm êm, tràn ngập tiếng cười và những khoảnh khắc yêu thương.<br>
            Con hứa sẽ cố gắng học tập và làm việc thật tốt mỗi ngày để Bố Mẹ luôn yên tâm và tự hào về con.`,
    ],

    children: [
      `Gửi các con yêu quý,<br><br>
            Năm mới đến trong niềm vui và sự háo hức, ba/mẹ xin gửi đến các con những lời chúc yêu thương nhất từ trái tim.<br>
            Chúc các con luôn khỏe mạnh, vui vẻ mỗi ngày, ăn ngoan, ngủ ngoan và học hành chăm chỉ, tiến bộ từng ngày.<br><br>
            Dù các con còn nhỏ hay đã lớn, ba/mẹ luôn dõi theo, tin tưởng và tự hào về từng cố gắng của các con.<br>
            Ba/mẹ yêu các con rất nhiều và sẽ luôn ở bên đồng hành cùng các con trên mọi chặng đường.`,

      `Các con yêu của ba/mẹ,<br><br>
            Năm mới lại về, ba/mẹ mong rằng năm nay sẽ mang đến cho các con thật nhiều may mắn và những điều tốt đẹp.<br>
            Chúc các con học giỏi hơn mỗi ngày, chơi vui nhưng vẫn biết ngoan ngoãn, lễ phép và yêu thương mọi người xung quanh.<br><br>
            Hãy luôn khỏe mạnh, hồn nhiên và lớn lên trong vòng tay yêu thương của gia đình nhé.<br>
            Ba/mẹ yêu các con rất nhiều, nhiều hơn những gì có thể nói thành lời!`,
    ],

    siblings: [
      `Gửi anh/chị/em thân yêu,<br><br>
            Xuân mới lại về, mang theo nhiều hy vọng và những khởi đầu tốt đẹp.<br>
            Anh/chị/em xin gửi đến mình lời chúc năm mới an khang, thịnh vượng, sức khỏe dồi dào và tinh thần luôn vững vàng.<br><br>
            Mong rằng trong năm mới, mọi dự định đều thuận lợi, mọi cố gắng đều được đền đáp xứng đáng.<br>
            Dù cuộc sống có nhiều thay đổi, tình cảm anh em mình vẫn luôn bền chặt và đáng trân quý.`,
    ],

    friends: [
      `Gửi bạn thân yêu,<br><br>
            Năm mới lại đến, mang theo những khởi đầu mới và nhiều hy vọng tốt đẹp.<br>
            Mình chúc bạn một năm thật nhiều sức khỏe, công việc thuận lợi, mọi dự định đều suôn sẻ và đạt được kết quả như mong muốn.<br><br>
            Cảm ơn bạn vì đã luôn đồng hành, chia sẻ và ở bên trong những chặng đường vừa qua.<br>
            Tình bạn của chúng ta là điều rất đáng trân trọng, và mình mong sẽ còn cùng nhau đi thật xa nữa.`,
    ],

    colleagues: [
      `Gửi anh/chị/bạn đồng nghiệp thân mến,<br><br>
            Nhân dịp năm mới, xin gửi đến anh/chị/bạn những lời chúc tốt đẹp và chân thành nhất.<br>
            Chúc anh/chị/bạn luôn dồi dào sức khỏe, tinh thần tích cực, công việc thuận lợi và đạt được nhiều kết quả tốt trong năm mới.<br><br>
            Mong rằng năm mới sẽ mang đến nhiều cơ hội phát triển, thành công trong sự nghiệp và hạnh phúc trong cuộc sống gia đình.<br>
            Chúc mừng năm mới!`,
    ],

    aunt_uncle: [
      `Kính gửi Cô/Dì/Chú/Bác,<br><br>
            Nhân dịp xuân về năm mới, cháu xin kính chúc Cô/Dì/Chú/Bác luôn dồi dào sức khỏe, tinh thần an vui và cuộc sống bình an.<br>
            Mong rằng năm mới sẽ mang đến nhiều niềm vui, may mắn và hạnh phúc cho Cô/Dì/Chú/Bác cùng gia đình.<br><br>
            Cháu kính chúc Cô/Dì/Chú/Bác một năm mới an khang, vạn sự như ý.`,
    ],

    lovers: [
      `Gửi người thương yêu,<br><br>
            Một mùa xuân mới lại về, anh/em muốn gửi đến em/anh những lời chúc xuất phát từ tận đáy lòng.<br>
            Chúc em/anh một năm mới thật nhiều sức khỏe, bình an và luôn mỉm cười hạnh phúc.<br><br>
            Cảm ơn em/anh vì đã ở bên anh/em, cùng anh/em đi qua những khoảnh khắc giản dị nhưng đầy yêu thương. Mong rằng năm mới này, chúng ta vẫn sẽ nắm tay nhau thật chặt.`,
    ],
  };

  // ========== LOCALSTORAGE ==========
  function loadSavedName() {
    const saved = localStorage.getItem("lixi_sender_name");
    if (saved) {
      senderName = saved;
      if (minimizedNameDisplay) minimizedNameDisplay.textContent = saved;
      return true;
    }
    return false;
  }

  function saveName(name) {
    localStorage.setItem("lixi_sender_name", name);
    senderName = name;
  }

  function loadAmountRanges() {
    const defaults = {
      grandparents: { min: 100000, max: 200000 },
      parents: { min: 100000, max: 200000 },
      lovers: { min: 100000, max: 200000 },
      others: { min: 10000, max: 50000 },
    };
    try {
      const saved = JSON.parse(
        localStorage.getItem("lixi_amount_ranges") || "{}",
      );
      return {
        grandparents: { ...defaults.grandparents, ...saved.grandparents },
        parents: { ...defaults.parents, ...saved.parents },
        lovers: { ...defaults.lovers, ...saved.lovers },
        others: { ...defaults.others, ...saved.others },
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

  // ========== SETTINGS LOGIC ==========
  function updateSettingsUI() {
    ["grandparents", "parents", "lovers", "others"].forEach((group) => {
      const minInput = document.getElementById(`min-${group}`);
      const maxInput = document.getElementById(`max-${group}`);
      const minDisplay = document.getElementById(`display-min-${group}`);
      const maxDisplay = document.getElementById(`display-${group}`);

      if (minInput && maxInput && minDisplay && maxDisplay) {
        minInput.value = amountRanges[group].min;
        maxInput.value = amountRanges[group].max;
        minDisplay.textContent = formatCurrency(amountRanges[group].min);
        maxDisplay.textContent = formatCurrency(amountRanges[group].max);
      }
    });
  }

  function syncMinMax(group, changedType) {
    const minInput = document.getElementById(`min-${group}`);
    const maxInput = document.getElementById(`max-${group}`);
    const minDisplay = document.getElementById(`display-min-${group}`);
    const maxDisplay = document.getElementById(`display-${group}`);

    if (!minInput || !maxInput || !minDisplay || !maxDisplay) return;

    let minVal = Number(minInput.value);
    let maxVal = Number(maxInput.value);

    if (minVal > maxVal) {
      if (changedType === "min") {
        maxInput.value = minVal;
        maxDisplay.textContent = formatCurrency(minVal);
      } else if (changedType === "max") {
        minInput.value = maxVal;
        minDisplay.textContent = formatCurrency(maxVal);
      }
    } else {
      minDisplay.textContent = formatCurrency(minVal);
      maxDisplay.textContent = formatCurrency(maxVal);
    }
  }

  document
    .querySelectorAll('#settings-modal input[type="range"]')
    .forEach((slider) => {
      slider.addEventListener("input", () => {
        const parts = slider.id.split("-");
        const type = parts[0];
        const group = parts.slice(1).join("-");
        syncMinMax(group, type);
      });
    });

  settingsBtn?.addEventListener("click", () => {
    updateSettingsUI();
    settingsModal?.classList.remove("hidden");
  });

  closeSettings?.addEventListener("click", () =>
    settingsModal?.classList.add("hidden"),
  );
  settingsModal?.addEventListener("click", (e) => {
    if (e.target === settingsModal) settingsModal.classList.add("hidden");
  });

  saveSettingsBtn?.addEventListener("click", () => {
    ["grandparents", "parents", "lovers", "others"].forEach((group) => {
      const minInput = document.getElementById(`min-${group}`);
      const maxInput = document.getElementById(`max-${group}`);

      if (minInput && maxInput) {
        let minVal = Number(minInput.value);
        let maxVal = Number(maxInput.value);

        if (minVal > maxVal) {
          maxVal = minVal;
          maxInput.value = maxVal;
        }

        amountRanges[group] = {
          min: minVal,
          max: maxVal,
        };
      }
    });

    localStorage.setItem("lixi_amount_ranges", JSON.stringify(amountRanges));
    settingsModal?.classList.add("hidden");
  });

  // ========== NAME & INITIALIZATION ==========
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

  if (senderNameInput) {
    senderNameInput.addEventListener("input", function () {
      if (confirmNameBtn)
        confirmNameBtn.disabled = this.value.trim().length === 0;
    });

    senderNameInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && this.value.trim().length > 0)
        confirmNameBtn.click();
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

  // Step Indicator - UPDATED: chỉ còn 3 bước
  function updateStepIndicator(currentStep) {
    [step1Dot, step2Dot, step3Dot].forEach((dot) => {
      dot?.classList.remove("completed", "active");
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
  }

  // ========== RELATIONSHIP SELECTION ==========
  function initRelationshipSelection() {
    if (!relationshipGrid) return;
    relationshipGrid.innerHTML = "";

    relationships.forEach((relationship) => {
      const card = document.createElement("div");
      card.className =
        "selection-card rounded-xl p-4 text-center cursor-pointer h-full";
      card.dataset.relationship = relationship.id;
      card.innerHTML = `
                <div class="text-3xl text-amber-300 mb-3"><i class="${relationship.icon}"></i></div>
                <div class="text-lg font-bold text-white mb-1">${relationship.name}</div>
                <div class="text-amber-200 text-sm">${relationship.formal}</div>
            `;

      card.addEventListener("click", function () {
        if (selectedRelationship === this) return;

        document
          .querySelectorAll("#relationship-selection .selection-card")
          .forEach((c) => {
            c.classList.remove("selected");
          });

        selectedRelationship = this;
        selectedRelationshipId = relationship.id;
        this.classList.add("selected");

        // CHANGED: Luôn chuyển thẳng đến hongbao, không cần kiểm tra needsAge
        updateStepIndicator(3);
        setTimeout(() => {
          createHongbaos();
          if (hongbaoSelection) hongbaoSelection.classList.remove("hidden");
          if (hongbaoSelection)
            hongbaoSelection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      });

      relationshipGrid.appendChild(card);
    });
  }

  // ========== RANDOM AMOUNT ==========
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

    const popularAmounts = [10000, 20000, 50000, 100000, 200000, 500000];
    const possibleAmounts = popularAmounts.filter(
      (amount) => amount >= min && amount <= max,
    );
    if (possibleAmounts.length === 0) {
      return popularAmounts.reduce((prev, curr) =>
        Math.abs(curr - min) < Math.abs(prev - min) ? curr : prev,
      );
    }
    const randomIndex = Math.floor(Math.random() * possibleAmounts.length);
    return possibleAmounts[randomIndex];
  }

  // ========== CREATE HONGBAOS ==========
  function createHongbaos() {
    if (!hongbaoGrid) return;

    hongbaoGrid.innerHTML = "";

    const colorVariants = [
      "from-red-600 to-red-800",
      "from-red-700 to-red-900",
      "from-amber-600 to-amber-800",
      "from-red-800 to-red-950",
      "from-amber-700 to-amber-900",
      "from-red-900 to-amber-900",
      "from-amber-800 to-red-900",
      "from-red-700 to-amber-800",
      "from-amber-900 to-red-800",
      "from-red-800 to-amber-700",
      "from-amber-800 to-red-950",
      "from-red-950 to-amber-800",
      "from-amber-900 to-red-700",
      "from-red-900 to-amber-950",
      "from-red-600 to-amber-700",
      "from-amber-700 to-red-800",
      "from-red-800 to-amber-800",
      "from-amber-800 to-red-700",
      "from-red-700 to-amber-900",
      "from-amber-900 to-red-600",
      "from-red-900 to-amber-700",
      "from-amber-700 to-red-900",
      "from-red-600 to-amber-800",
      "from-amber-800 to-red-600",
      "from-red-600 to-red-800",
      "from-red-700 to-red-900",
      "from-amber-600 to-amber-800",
      "from-red-800 to-red-950",
      "from-amber-700 to-amber-900",
      "from-red-900 to-amber-900",
      "from-amber-800 to-red-900",
      "from-red-700 to-amber-800",
      "from-amber-900 to-red-800",
      "from-red-800 to-amber-700",
      "from-amber-800 to-red-950",
      "from-red-950 to-amber-800",
      "from-amber-900 to-red-700",
      "from-red-900 to-amber-950",
      "from-red-600 to-amber-700",
      "from-amber-700 to-red-800",
    ];

    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= 40; i++) {
      const colorClass = colorVariants[i - 1];
      const hongbaoItem = document.createElement("div");
      hongbaoItem.className = `hongbao-card rounded-lg flex flex-col cursor-pointer h-40 md:h-48`;
      hongbaoItem.dataset.id = i;

      hongbaoItem.innerHTML = `
                <div class="hongbao-top h-8 md:h-10 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    <div class="hidden md:block text-red-900 font-bold text-sm md:text-base tracking-wider relative z-10">
                        LỘC
                    </div>
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

      hongbaoItem.addEventListener("click", function (e) {
        if (selectedHongbao === this || isRolling) return;
        e.stopPropagation();

        requestAnimationFrame(() => {
          document.querySelectorAll(".hongbao-card").forEach((item) => {
            item.classList.remove("selected");
          });

          selectedHongbao = this;
          this.classList.add("selected");

          setTimeout(() => {
            showDiceLoadingModal(i);
          }, 300);
        });
      });

      fragment.appendChild(hongbaoItem);
    }

    requestAnimationFrame(() => {
      hongbaoGrid.appendChild(fragment);
    });
  }

  function showDiceLoadingModal(selectedId) {
    if (diceLoadingModal) diceLoadingModal.classList.remove("hidden");
    if (modalOverlay) modalOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    startDiceRolling(selectedId);
  }

  function startDiceRolling(selectedId) {
    isRolling = true;
    if (dice1Loading) dice1Loading.classList.add("rolling");
    if (dice2Loading) dice2Loading.classList.add("rolling");
    if (dice3Loading) dice3Loading.classList.add("rolling");

    currentAmount = getRandomAmount();
    const letter = generateLetter();
    const message =
      moneyMessages[Math.floor(Math.random() * moneyMessages.length)];

    setTimeout(() => {
      stopDiceRolling();
      isRolling = false;

      setTimeout(() => {
        if (diceLoadingModal) diceLoadingModal.classList.add("hidden");
        showLetterAndScratch(letter, currentAmount, message);
      }, 1000);
    }, 3000);
  }

  function generateLetter() {
    const today = new Date();
    const dateStr = today.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const relationship = relationships.find(
      (r) => r.id === selectedRelationshipId,
    );
    const templates =
      letterTemplates[selectedRelationshipId] || letterTemplates.friends;
    const randomContent =
      templates[Math.floor(Math.random() * templates.length)];

    return {
      date: `Ngày ${dateStr}`,
      greeting: `${relationship.formal},`,
      content: randomContent,
      closing: letterClosings[selectedRelationshipId],
    };
  }

  function stopDiceRolling() {
    if (dice1Loading) dice1Loading.classList.remove("rolling");
    if (dice2Loading) dice2Loading.classList.remove("rolling");
    if (dice3Loading) dice3Loading.classList.remove("rolling");

    const diceValues = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];

    const rotations = [
      { x: diceValues[0] * 60, y: diceValues[0] * 60 },
      { x: diceValues[1] * 60, y: diceValues[1] * 60 },
      { x: diceValues[2] * 60, y: diceValues[2] * 60 },
    ];

    if (dice1Loading)
      dice1Loading.style.transform = `rotateX(${rotations[0].x}deg) rotateY(${rotations[0].y}deg)`;
    if (dice2Loading)
      dice2Loading.style.transform = `rotateX(${rotations[1].x}deg) rotateY(${rotations[1].y}deg)`;
    if (dice3Loading)
      dice3Loading.style.transform = `rotateX(${rotations[2].x}deg) rotateY(${rotations[2].y}deg)`;
  }

  function showLetterAndScratch(letter, amount, message) {
    if (resultModal) resultModal.classList.remove("hidden");
    if (letterDate) letterDate.textContent = letter.date;
    if (letterContent) letterContent.innerHTML = letter.content;
    if (letterClosing) letterClosing.textContent = letter.closing;
    if (signatureName) signatureName.textContent = senderName;
    if (moneyAmount) moneyAmount.textContent = formatCurrency(amount);
    initScratchCard();
  }

  // ========== SCRATCH CARD ==========
  function initScratchCard() {
    const container = document.querySelector(".scratch-card-container");
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

    const silverGradient = ctx.createLinearGradient(
      0,
      0,
      scratchCanvas.width,
      scratchCanvas.height,
    );
    silverGradient.addColorStop(0, "#E8E8E8");
    silverGradient.addColorStop(0.3, "#D0D0D0");
    silverGradient.addColorStop(0.5, "#C0C0C0");
    silverGradient.addColorStop(0.7, "#D0D0D0");
    silverGradient.addColorStop(1, "#E8E8E8");
    ctx.fillStyle = silverGradient;
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let x = 15; x < scratchCanvas.width; x += 20) {
      for (let y = 15; y < scratchCanvas.height; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const shineGradient = ctx.createLinearGradient(
      0,
      0,
      scratchCanvas.width,
      scratchCanvas.height,
    );
    shineGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    shineGradient.addColorStop(0.4, "rgba(255, 255, 255, 0.05)");
    shineGradient.addColorStop(0.6, "rgba(255, 255, 255, 0.05)");
    shineGradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
    ctx.fillStyle = shineGradient;
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    ctx.fillStyle = "#8B4513";
    ctx.font = "bold 16px 'Noto Serif', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillText(
      "Đón nhận may mắn đầu năm.",
      scratchCanvas.width / 2,
      scratchCanvas.height / 2,
    );
    ctx.shadowColor = "transparent";

    scratchCanvas.addEventListener("mousedown", handleMouseDown);
    scratchCanvas.addEventListener("mousemove", handleMouseMove);
    scratchCanvas.addEventListener("mouseup", handleMouseUp);
    scratchCanvas.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    scratchCanvas.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
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
    const gradient = ctx.createRadialGradient(
      clampedX,
      clampedY,
      0,
      clampedX,
      clampedY,
      radius,
    );
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0.9)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(clampedX, clampedY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // ========== CLOSE MODAL ==========
  function closeModal() {
    if (resultModal) resultModal.classList.add("hidden");
    if (diceLoadingModal) diceLoadingModal.classList.add("hidden");
    if (modalOverlay) modalOverlay.classList.add("hidden");
    document.body.style.overflow = "auto";

    if (dice1Loading) dice1Loading.style.transform = "";
    if (dice2Loading) dice2Loading.style.transform = "";
    if (dice3Loading) dice3Loading.style.transform = "";

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
      if (
        e.target === modalOverlay &&
        (!resultModal.classList.contains("hidden") ||
          !diceLoadingModal.classList.contains("hidden"))
      ) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      (!resultModal.classList.contains("hidden") ||
        !diceLoadingModal.classList.contains("hidden"))
    ) {
      closeModal();
    }
  });

  /* ================================================
       PHÁO HOA - Auto Fireworks System
       ================================================ */
  const canvas = document.getElementById("fireworks-canvas");
  const fwCtx = canvas ? canvas.getContext("2d") : null;
  let fireworks = [];
  let particles = [];
  let animationId = null;
  let fireworkRoundCount = 0;

  function resizeFireworksCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  if (canvas) {
    resizeFireworksCanvas();
    window.addEventListener("resize", resizeFireworksCanvas);
  }

  class Firework {
    constructor(sx, sy, tx, ty) {
      this.x = sx;
      this.y = sy;
      this.sx = sx;
      this.sy = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = this.calculateDistance(sx, sy, tx, ty);
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 2;
      this.acceleration = 1.05;
      this.brightness = Math.random() * 50 + 50;
      this.targetRadius = 1;
    }

    calculateDistance(sx, sy, tx, ty) {
      const xDistance = sx - tx;
      const yDistance = sy - ty;
      return Math.sqrt(xDistance ** 2 + yDistance ** 2);
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
      } else {
        this.targetRadius = 1;
      }

      this.speed *= this.acceleration;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = this.calculateDistance(
        this.sx,
        this.sy,
        this.x + vx,
        this.y + vy,
      );

      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw() {
      if (!fwCtx) return;
      fwCtx.beginPath();
      fwCtx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1],
      );
      fwCtx.lineTo(this.x, this.y);
      fwCtx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
      fwCtx.stroke();

      fwCtx.beginPath();
      fwCtx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
      fwCtx.stroke();
    }
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 10 + 1;
      this.friction = 0.96;
      this.gravity = 0.8;
      this.hue = Math.random() * 360;
      this.brightness = Math.random() * 80 + 50;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.01;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }

    draw() {
      if (!fwCtx) return;
      fwCtx.beginPath();
      fwCtx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1],
      );
      fwCtx.lineTo(this.x, this.y);
      fwCtx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      fwCtx.stroke();
    }
  }

  function createParticles(x, y) {
    let particleCount = 120;
    while (particleCount--) {
      particles.push(new Particle(x, y));
    }
  }

  function animateFireworks() {
    if (!fwCtx || !canvas) return;

    animationId = requestAnimationFrame(animateFireworks);
    fwCtx.globalCompositeOperation = "destination-out";
    fwCtx.fillStyle = "rgba(0, 0, 0, 0.3)";
    fwCtx.fillRect(0, 0, canvas.width, canvas.height);
    fwCtx.globalCompositeOperation = "lighter";

    let i = fireworks.length;
    while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    i = particles.length;
    while (i--) {
      particles[i].draw();
      particles[i].update(i);
    }

    if (fireworks.length === 0 && particles.length === 0) {
      cancelAnimationFrame(animationId);
      animationId = null;
      if (fwCtx && canvas) {
        fwCtx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  function launchFirework() {
    if (!canvas) return;
    const sx = canvas.width / 2;
    const sy = canvas.height;
    const tx = Math.random() * canvas.width;
    const ty = (Math.random() * canvas.height) / 2;
    fireworks.push(new Firework(sx, sy, tx, ty));

    if (!animationId) {
      animateFireworks();
    }
  }

  function launchMultipleFireworks(count) {
    if (!canvas || !fwCtx) return;

    let launched = 0;
    const interval = setInterval(() => {
      launchFirework();
      launched++;
      if (launched >= count) {
        clearInterval(interval);
      }
    }, 150);
  }

  function startBigFinale() {
    if (!canvas || !fwCtx) return;

    const finaleCount = Math.floor(Math.random() * 21) + 30;
    let launched = 0;
    const interval = setInterval(() => {
      launchFirework();
      launched++;
      if (launched >= finaleCount) {
        clearInterval(interval);
      }
    }, 100);
  }

  function scheduleNextFireworkRound() {
    setTimeout(() => {
      fireworkRoundCount++;

      if (fireworkRoundCount >= 5) {
        startBigFinale();
        fireworkRoundCount = 0;
      } else {
        const count = Math.floor(Math.random() * 3) + 3;
        launchMultipleFireworks(count);
      }

      scheduleNextFireworkRound();
    }, 30000);
  }

  setTimeout(() => {
    scheduleNextFireworkRound();
  }, 5000);

  /* ================================================
       CÁNH HOA MAI RƠI
       ================================================ */
  (function petalInit() {
    const layer = document.getElementById("petal-layer");
    if (!layer) return;

    function makePetalSVG(uid) {
      const colors = [
        { base: "#ffd700", light: "#ebe1a8" },
        { base: "#ffcc00", light: "#dfc86e" },
        { base: "#ffdb58", light: "#e9d393" },
        { base: "#ffe135", light: "#e4d486" },
        { base: "#ffc700", light: "#ecd05f" },
        { base: "#ffdf00", light: "#ecdd76" },
      ];
      const colorSet = colors[uid % colors.length];

      const shapes = [
        `M12,5 Q20,10 20,20 Q12,15 5,20 Q5,10 12,5Z`,
        `M20,6 Q25,13 20,20 Q15,13 20,6Z`,
        `M20,8 Q23,13 20,18 Q17,13 20,8Z`,
        `M12,3 Q20,12 12,22 Q5,12 12,3Z`,
      ];

      const shape = shapes[uid % shapes.length];

      return `<svg viewBox="0 0 40 25" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="petalGrad${uid}" cx="50%" cy="50%">
                  <stop offset="0%" stop-color="${colorSet.light}" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="${colorSet.base}" stop-opacity="0.9"/>
                </radialGradient>
              </defs>
              <path d="${shape}" fill="url(#petalGrad${uid})" opacity="0.92" stroke="${colorSet.base}" stroke-width="0.5"/>
              <path d="${shape}" fill="white" opacity="0.35" stroke="none"/>
            </svg>`;
    }

    function rand(a, b) {
      return a + Math.random() * (b - a);
    }
    function randInt(a, b) {
      return a + Math.floor(Math.random() * (b - a + 1));
    }

    let uid = 0;

    function spawnPetal() {
      uid++;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const w = rand(20, 32);
      const h = w * rand(0.75, 1.05);
      const START_OFFSET_Y = vh * 0.15;
      const fromLeft = Math.random() < 0.5;
      let x;

      if (fromLeft) {
        x = rand(0, Math.min(280, vw * 0.25));
      } else {
        x = rand(Math.max(vw - 280, vw * 0.75), vw);
      }

      const y = rand(-50, -5) + START_OFFSET_Y;

      const driftXEarly = rand(-70, 70);
      const driftXMid = rand(-100, 100);
      const driftXLate = rand(-90, 90);
      const driftXFinal = rand(-60, 60);
      const driftXEnd = rand(-50, 50);
      const driftXPull = rand(-35, 35);

      const dur = rand(16, 26);
      const sway = rand(5, 8);
      const delay = rand(0, 2.5);
      const rotSpeed = rand(14, 24);

      const wrap = document.createElement("div");
      wrap.className = "petal-wrap";
      wrap.style.cssText =
        `position:absolute;` +
        `left:${x}px;` +
        `top:${y}px;` +
        `width:${w}px;` +
        `height:${h}px;` +
        `opacity:0;` +
        `filter:drop-shadow(0 4px 8px rgba(255,215,0,0.35));` +
        `animation:petalFloatAndDrift ${dur}s ease-in-out forwards;` +
        `animation-delay:${delay}s;` +
        `--drift-x-early:${driftXEarly}px;` +
        `--drift-x-mid:${driftXMid}px;` +
        `--drift-x-late:${driftXLate}px;` +
        `--drift-x-final:${driftXFinal}px;` +
        `--drift-x-end:${driftXEnd}px;` +
        `--drift-x-pull:${driftXPull}px;`;

      const spin = document.createElement("div");
      spin.className = "petal-spin";
      spin.style.cssText =
        `width:100%;` +
        `height:100%;` +
        `animation:` +
        `petalGentleSway ${sway}s ease-in-out infinite,` +
        `petalGentleRotate ${rotSpeed}s linear infinite;`;

      spin.innerHTML = makePetalSVG(uid);
      wrap.appendChild(spin);
      layer.appendChild(wrap);

      setTimeout(
        () => {
          wrap.remove();
        },
        (dur + delay) * 1000 + 1000,
      );
    }

    function loop() {
      const n = randInt(1, 2);
      for (let i = 0; i < n; i++) {
        setTimeout(() => spawnPetal(), i * 300);
      }
      setTimeout(loop, rand(1800, 2400));
    }

    setTimeout(loop, 800);
  })();

  // ===== EXPORT & SHARE FUNCTIONALITY =====
  // FIXED: Lưu ảnh với khung cố định
  async function convertLetterToImage() {
    const letterElement = document.getElementById("letter-to-share");

    const downloadBtn = document.getElementById("download-letter-btn");
    const shareBtn = document.getElementById("share-letter-btn");
    const originalDownloadHTML = downloadBtn.innerHTML;
    const originalShareHTML = shareBtn.innerHTML;

    downloadBtn.disabled = true;
    shareBtn.disabled = true;
    downloadBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    shareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';

    try {
      // FIXED: Khung cố định - không theo màn hình
      const canvas = await html2canvas(letterElement, {
        scale: 3,
        backgroundColor: "#f8f4e8",
        useCORS: true,
        logging: false,
        width: 800,  // FIXED WIDTH
        height: 1000, // FIXED HEIGHT
        windowWidth: 800,
        windowHeight: 1000,
        scrollY: 0,
        scrollX: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("letter-to-share");
          if (clonedElement) {
            clonedElement.style.maxHeight = "none";
            clonedElement.style.overflow = "visible";
            clonedElement.style.width = "800px";
            clonedElement.style.minHeight = "1000px";
          }
        },
      });

      return canvas;
    } catch (error) {
      console.error("Lỗi khi tạo ảnh:", error);
      alert("Không thể tạo ảnh. Vui lòng thử lại!");
      return null;
    } finally {
      downloadBtn.disabled = false;
      shareBtn.disabled = false;
      downloadBtn.innerHTML = originalDownloadHTML;
      shareBtn.innerHTML = originalShareHTML;
    }
  }

  async function downloadLetterImage() {
    const canvas = await convertLetterToImage();
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const timestamp = new Date().getTime();
        link.download = `li-xi-tet-2026-${timestamp}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      "image/png",
      1.0,
    );
  }

  async function shareLetterImage() {
    const canvas = await convertLetterToImage();
    if (!canvas) return;

    canvas.toBlob(
      async (blob) => {
        const file = new File([blob], "li-xi-tet-2026.png", {
          type: "image/png",
        });

        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              title: "Lì Xì Tết 2026",
              text: "Gửi trao lời chúc và lộc xuân đầu năm 🧧✨",
              files: [file],
            });
          } catch (error) {
            if (error.name !== "AbortError") {
              console.error("Lỗi khi share:", error);
              downloadLetterImage();
            }
          }
        } else {
          alert(
            "Trình duyệt không hỗ trợ chia sẻ trực tiếp. Ảnh sẽ được tải xuống!",
          );
          downloadLetterImage();
        }
      },
      "image/png",
      1.0,
    );
  }

  document
    .getElementById("download-letter-btn")
    .addEventListener("click", downloadLetterImage);
  document
    .getElementById("share-letter-btn")
    .addEventListener("click", shareLetterImage);
});