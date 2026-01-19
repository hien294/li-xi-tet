document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const relationshipSelection = document.getElementById(
    "relationship-selection",
  );
  const relationshipGrid = relationshipSelection.querySelector(".grid");
  const ageSelection = document.getElementById("age-selection");
  const ageGrid = ageSelection.querySelector(".grid");
  const hongbaoSelection = document.getElementById("hongbao-selection");
  const hongbaoGrid = document.getElementById("hongbao-grid");
  const resultModal = document.getElementById("result-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const diceSection = document.getElementById("dice-section");
  const letterScratchSection = document.getElementById(
    "letter-scratch-section",
  );
  const dice1 = document.getElementById("dice1");
  const dice2 = document.getElementById("dice2");
  const dice3 = document.getElementById("dice3");
  const letterDate = document.getElementById("letter-date");
  const letterGreeting = document.getElementById("letter-greeting");
  const letterContent = document.getElementById("letter-content");
  const letterClosing = document.getElementById("letter-closing");
  let scratchCanvas = document.getElementById("scratch-canvas"); // Không dùng const để có thể gán lại
  const moneyAmount = document.getElementById("money-amount");
  const moneyMessage = document.getElementById("money-message");
  const closeModalBtn = document.getElementById("close-modal");
  const playAgainBtn = document.getElementById("play-again-btn");
  const step1Dot = document.getElementById("step1-dot");
  const step2Dot = document.getElementById("step2-dot");
  const step3Dot = document.getElementById("step3-dot");
  const scrollToAge = document.getElementById("scroll-to-age");
  const scrollToHongbao = document.getElementById("scroll-to-hongbao");

  // Variables
  let selectedRelationship = null;
  let selectedAge = null;
  let selectedHongbao = null;
  let isRolling = false;
  let isScratching = false;
  let ctx = null;
  let currentAmount = 0;
  let selectedRelationshipId = "";
  let selectedAgeId = "";

  // Relationships (8 options)
  const relationships = [
    {
      id: "grandparents",
      name: "Ông Bà",
      icon: "fas fa-users",
      formal: "Kính gửi Ông Bà",
    },
    {
      id: "parents",
      name: "Bố Mẹ",
      icon: "fas fa-home",
      formal: "Kính gửi Bố Mẹ",
    },
    {
      id: "children",
      name: "Con Cái",
      icon: "fas fa-child",
      formal: "Gửi các con yêu",
    },
    {
      id: "siblings",
      name: "Anh Chị Em",
      icon: "fas fa-user-friends",
      formal: "Gửi anh/chị/em",
    },
    {
      id: "aunt_uncle",
      name: "Cô Dì Chú Bác",
      icon: "fas fa-hands-helping",
      formal: "Kính gửi Cô/Dì/Chú/Bác",
    },
    {
      id: "friends",
      name: "Bạn Bè",
      icon: "fas fa-user-friends",
      formal: "Gửi bạn thân",
    },
    {
      id: "colleagues",
      name: "Đồng Nghiệp",
      icon: "fas fa-briefcase",
      formal: "Gửi đồng nghiệp",
    },
    {
      id: "lovers",
      name: "Người Yêu",
      icon: "fas fa-heart",
      formal: "Gửi người yêu dấu",
    },
  ];

  // Age groups (8 options)
  const ageGroups = [
    {
      id: "child",
      name: "Trẻ Em",
      range: "1-12 tuổi",
      icon: "fas fa-baby",
    },
    {
      id: "teen",
      name: "Thiếu Niên",
      range: "13-17 tuổi",
      icon: "fas fa-user-graduate",
    },
    {
      id: "young_adult",
      name: "Thanh Niên",
      range: "18-25 tuổi",
      icon: "fas fa-user-graduate",
    },
    {
      id: "adult",
      name: "Trưởng Thành",
      range: "26-40 tuổi",
      icon: "fas fa-user-tie",
    },
    {
      id: "middle_age",
      name: "Trung Niên",
      range: "41-55 tuổi",
      icon: "fas fa-user",
    },
    {
      id: "senior",
      name: "Trung Lão",
      range: "56-70 tuổi",
      icon: "fas fa-user-friends",
    },
    {
      id: "elder",
      name: "Cao Tuổi",
      range: "71-85 tuổi",
      icon: "fas fa-user-clock",
    },
    {
      id: "venerable",
      name: "Thượng Thọ",
      range: "86+ tuổi",
      icon: "fas fa-user-ninja",
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

  // Update Step Indicator
  function updateStepIndicator(currentStep) {
    step1Dot.classList.remove("completed", "active");
    step2Dot.classList.remove("completed", "active");
    step3Dot.classList.remove("completed", "active");

    if (currentStep === 1) {
      step1Dot.classList.add("active");
    } else if (currentStep === 2) {
      step1Dot.classList.add("completed");
      step2Dot.classList.add("active");
    } else if (currentStep === 3) {
      step1Dot.classList.add("completed");
      step2Dot.classList.add("completed");
      step3Dot.classList.add("active");
    }
  }

  // Initialize Relationship Selection
  function initRelationshipSelection() {
    relationshipGrid.innerHTML = "";

    relationships.forEach((relationship) => {
      const card = document.createElement("div");
      card.className =
        "selection-card rounded-xl p-4 text-center cursor-pointer h-full";
      card.dataset.relationship = relationship.id;

      card.innerHTML = `
                        <div class="text-3xl text-amber-300 mb-3">
                            <i class="${relationship.icon}"></i>
                        </div>
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

        updateStepIndicator(2);
        scrollToAge.classList.remove("hidden");

        setTimeout(() => {
          initAgeSelection();
          ageSelection.classList.remove("hidden");
          ageSelection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          setTimeout(() => {
            scrollToAge.classList.add("hidden");
          }, 1000);
        }, 300);
      });

      relationshipGrid.appendChild(card);
    });

    updateStepIndicator(1);
  }

  // Initialize Age Selection
  function initAgeSelection() {
    ageGrid.innerHTML = "";

    ageGroups.forEach((age) => {
      const card = document.createElement("div");
      card.className =
        "selection-card rounded-xl p-4 text-center cursor-pointer h-full";
      card.dataset.age = age.id;

      card.innerHTML = `
                        <div class="text-3xl text-amber-300 mb-3">
                            <i class="${age.icon}"></i>
                        </div>
                        <div class="text-lg font-bold text-white mb-1">${age.name}</div>
                        <div class="text-amber-200 text-sm">${age.range}</div>
                    `;

      card.addEventListener("click", function () {
        if (selectedAge === this) return;

        document
          .querySelectorAll("#age-selection .selection-card")
          .forEach((c) => {
            c.classList.remove("selected");
          });

        selectedAge = this;
        selectedAgeId = age.id;
        this.classList.add("selected");

        updateStepIndicator(3);
        scrollToHongbao.classList.remove("hidden");

        setTimeout(() => {
          createHongbaos();
          hongbaoSelection.classList.remove("hidden");
          hongbaoSelection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          setTimeout(() => {
            scrollToHongbao.classList.add("hidden");
          }, 1000);
        }, 300);
      });

      ageGrid.appendChild(card);
    });
  }

  // Create 24 Hongbaos
  function createHongbaos() {
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
    ];

    for (let i = 1; i <= 24; i++) {
      const colorClass = colorVariants[i - 1];

      const hongbaoItem = document.createElement("div");
      hongbaoItem.className = `hongbao-card rounded-lg flex flex-col cursor-pointer h-40 md:h-48`;
      hongbaoItem.dataset.id = i;

      hongbaoItem.innerHTML = `
                        <!-- Top Gold Part -->
                        <div class="hongbao-top h-8 md:h-10 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                            <div class="text-red-900 font-bold text-sm md:text-base tracking-wider relative z-10">LỘC</div>
                        </div>
                        
                        <!-- Main Body -->
                        <div class="flex-grow bg-gradient-to-br ${colorClass} rounded-b-lg p-3 flex flex-col items-center justify-center relative">
                            <!-- Number Badge -->
                            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 hongbao-number w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg">
                                ${i}
                            </div>
                            
                            <!-- Content -->
                            <div class="text-amber-200 text-lg font-bold mb-1 font-playfair">BAO</div>
                            <div class="text-amber-300 text-2xl md:text-3xl font-bold font-dancing">${String(i).padStart(2, "0")}</div>
                            <div class="text-amber-100/80 text-xs mt-1">Nhấn chọn</div>
                            
                            <!-- Decorative Elements -->
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

  // Show Result Modal
  function showResultModal(selectedId) {
    diceSection.classList.remove("hidden");
    letterScratchSection.classList.add("hidden");
    playAgainBtn.classList.add("hidden");

    resultModal.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    startDiceRolling(selectedId);
  }

  // Start Dice Rolling
  function startDiceRolling(selectedId) {
    isRolling = true;

    dice1.classList.add("rolling");
    dice2.classList.add("rolling");
    dice3.classList.add("rolling");

    currentAmount = getRandomAmount();
    const letter = generateLetter();
    const message =
      moneyMessages[Math.floor(Math.random() * moneyMessages.length)];

    setTimeout(() => {
      stopDiceRolling();
      isRolling = false;

      setTimeout(() => {
        showLetterAndScratch(letter, currentAmount, message);
      }, 1000);
    }, 3000);
  }

  // Generate Letter
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

    let content = "";

    switch (selectedRelationshipId) {
      case "grandparents":
        content = `Xuân mới lại về, mang theo bao niềm vui và hy vọng. Nhân dịp năm mới, cháu xin gửi đến Ông Bà lời chúc sức khỏe, an khang và thịnh vượng.<br><br>Chúc Ông Bà luôn dồi dào sức khỏe, tinh thần minh mẫn, và tràn đầy niềm vui trong cuộc sống. Mong rằng năm mới sẽ mang đến nhiều may mắn, thành công và hạnh phúc cho Ông Bà.<br><br>Dù không gian có cách trở nhưng tấm lòng và tình cảm luôn hướng về Ông Bà. Xin gửi qua những dòng chữ này tất cả sự kính trọng và yêu thương chân thành nhất.`;
        break;
      case "parents":
        content = `Gửi Bố Mẹ yêu quý,<br><br>Xuân mới lại về, con xin gửi đến Bố Mẹ những lời chúc tốt đẹp nhất. Chúc Bố Mẹ năm mới thật nhiều sức khỏe, luôn vui vẻ và hạnh phúc.<br><br>Cảm ơn Bố Mẹ đã luôn yêu thương, chăm sóc và dạy dỗ con nên người. Mỗi dịp Tết đến, con lại nhớ về những kỷ niệm đẹp bên gia đình, những bữa cơm sum vầy ấm áp.<br><br>Con hứa sẽ cố gắng học tập và làm việc thật tốt để không phụ lòng Bố Mẹ. Con yêu Bố Mẹ nhiều lắm!`;
        break;
      case "children":
        content = `Gửi các con yêu quý,<br><br>Năm mới đến, ba/mẹ gửi đến các con lời chúc tốt đẹp nhất. Chúc các con luôn khỏe mạnh, vui vẻ và học hành chăm ngoan.<br><br>Ba/mẹ rất tự hào về các con, những đứa trẻ ngoan ngoãn và hiếu thảo. Mong rằng năm mới sẽ mang đến cho các con thật nhiều niềm vui, thành tích tốt trong học tập và nhiều kỷ niệm đẹp.<br><br>Hãy luôn giữ cho mình trái tim ấm áp và tinh thần lạc quan. Ba/mẹ yêu các con rất nhiều!`;
        break;
      default:
        content = `Xuân mới lại về, mang theo bao niềm vui và hy vọng. Nhân dịp năm mới, xin gửi đến ${relationship.name.toLowerCase()} lời chúc sức khỏe, an khang và thịnh vượng.<br><br>Chúc ${relationship.name.toLowerCase()} luôn dồi dào sức khỏe, tinh thần minh mẫn, và tràn đầy niềm vui trong cuộc sống. Mong rằng năm mới sẽ mang đến nhiều may mắn, thành công và hạnh phúc.<br><br>Dù không gian có cách trở nhưng tấm lòng và tình cảm luôn hướng về ${relationship.name.toLowerCase()}. Xin gửi qua những dòng chữ này tất cả sự trân trọng và yêu thương chân thành nhất.`;
    }

    const letter = {
      date: `Ngày ${dateStr}`,
      greeting: `${relationship.formal},`,
      content: content,
      closing: letterClosings[selectedRelationshipId],
    };

    return letter;
  }

  // Stop Dice Rolling
  function stopDiceRolling() {
    dice1.classList.remove("rolling");
    dice2.classList.remove("rolling");
    dice3.classList.remove("rolling");

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

    dice1.style.transform = `rotateX(${rotations[0].x}deg) rotateY(${rotations[0].y}deg)`;
    dice2.style.transform = `rotateX(${rotations[1].x}deg) rotateY(${rotations[1].y}deg)`;
    dice3.style.transform = `rotateX(${rotations[2].x}deg) rotateY(${rotations[2].y}deg)`;
  }

  // Show Letter and Scratch
  function showLetterAndScratch(letter, amount, message) {
    diceSection.classList.add("hidden");
    letterScratchSection.classList.remove("hidden");

    letterDate.textContent = letter.date;
    letterGreeting.textContent = letter.greeting;
    letterContent.innerHTML = letter.content;
    letterClosing.textContent = letter.closing;

    moneyAmount.textContent = formatCurrency(amount);
    moneyMessage.textContent = message;

    initScratchCard();
  }

  // Get Random Amount
  function getRandomAmount() {
    const min = 50000;
    const max = 5000000;

    const rand = Math.random();
    let amount;

    if (rand < 0.02) {
      amount = min + Math.floor(Math.random() * (max * 2 - min + 1));
    } else if (rand < 0.1) {
      amount = min + Math.floor(Math.random() * (max - min + 1));
    } else if (rand < 0.4) {
      amount = min + Math.floor(Math.random() * (max / 2 - min + 1));
    } else {
      amount = min + Math.floor(Math.random() * (max / 4 - min + 1));
    }

    return Math.round(amount / 1000) * 1000;
  }

  // Format Currency
  function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN") + " ₫";
  }

  // Initialize Scratch Card - ĐÃ SỬA LỖI
  function initScratchCard() {
    // Lấy canvas element từ DOM
    scratchCanvas = document.getElementById("scratch-canvas");
    if (!scratchCanvas) {
      console.error("Không tìm thấy canvas element");
      return;
    }

    const container = scratchCanvas.parentElement;
    if (!container) {
      console.error("Không tìm thấy container của canvas");
      return;
    }

    // Lưu tham chiếu canvas gốc
    const originalCanvas = scratchCanvas;

    // Tạo canvas mới
    const newCanvas = document.createElement("canvas");
    newCanvas.className = originalCanvas.className;
    newCanvas.id = originalCanvas.id;

    // Thay thế canvas cũ bằng canvas mới
    container.replaceChild(newCanvas, originalCanvas);
    scratchCanvas = newCanvas;

    // Đặt kích thước canvas
    scratchCanvas.width = container.offsetWidth;
    scratchCanvas.height = container.offsetHeight;

    // Lấy context
    ctx = scratchCanvas.getContext("2d");

    // Vẽ lớp phủ
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    ctx.fillStyle = "#D3D3D3";
    for (let x = 0; x < scratchCanvas.width; x += 20) {
      for (let y = 0; y < scratchCanvas.height; y += 20) {
        if ((x + y) % 40 === 0) {
          ctx.fillRect(x, y, 10, 10);
        }
      }
    }

    const gradient = ctx.createLinearGradient(
      0,
      0,
      scratchCanvas.width,
      scratchCanvas.height,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.3)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    // Thêm text hướng dẫn
    ctx.fillStyle = "#8B4513";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Vui lòng cào tại đây", scratchCanvas.width / 2, 30);

    // Thêm event listeners
    scratchCanvas.addEventListener("mousedown", handleMouseDown);
    scratchCanvas.addEventListener("mousemove", handleMouseMove);
    scratchCanvas.addEventListener("mouseup", handleMouseUp);
    scratchCanvas.addEventListener("mouseleave", handleMouseUp);

    scratchCanvas.addEventListener("touchstart", handleTouchStart);
    scratchCanvas.addEventListener("touchmove", handleTouchMove);
    scratchCanvas.addEventListener("touchend", handleTouchEnd);

    scratchCanvas.addEventListener(
      "touchstart",
      (e) => e.preventDefault(),
      { passive: false },
    );
    scratchCanvas.addEventListener(
      "touchmove",
      (e) => e.preventDefault(),
      { passive: false },
    );
  }

  // Event handler functions
  function handleMouseDown(e) {
    isScratching = true;
    scratch(e.clientX, e.clientY);
  }

  function handleMouseMove(e) {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  }

  function handleMouseUp() {
    isScratching = false;
  }

  function handleTouchStart(e) {
    isScratching = true;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  }

  function handleTouchMove(e) {
    if (!isScratching || !e.touches.length) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  }

  function handleTouchEnd() {
    isScratching = false;
  }

  // Scratch Function
  function scratch(clientX, clientY) {
    if (!ctx || !scratchCanvas) return;

    const rect = scratchCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    ctx.globalCompositeOperation = "destination-out";

    const radius = 25;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0.8)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    checkScratchCompletion();
  }

  // Check Scratch Completion
  function checkScratchCompletion() {
    if (!ctx || !scratchCanvas) return;

    const imageData = ctx.getImageData(
      0,
      0,
      scratchCanvas.width,
      scratchCanvas.height,
    );
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentCount++;
      }
    }

    const totalPixels = pixels.length / 4;
    const scratchedPercent = (transparentCount / totalPixels) * 100;

    if (
      scratchedPercent > 25 &&
      !playAgainBtn.classList.contains("fade-in")
    ) {
      playAgainBtn.classList.remove("hidden");
      playAgainBtn.classList.add("fade-in");
    }
  }

  // Close Modal
  function closeModal() {
    resultModal.classList.add("hidden");
    modalOverlay.classList.add("hidden");
    document.body.style.overflow = "auto";

    dice1.style.transform = "";
    dice2.style.transform = "";
    dice3.style.transform = "";

    if (selectedHongbao) {
      selectedHongbao.classList.remove("selected");
      selectedHongbao = null;
    }

    hongbaoSelection.classList.add("hidden");
    ageSelection.classList.add("hidden");
    relationshipSelection.classList.remove("hidden");

    if (selectedRelationship) {
      selectedRelationship.classList.remove("selected");
      selectedRelationship = null;
    }
    if (selectedAge) {
      selectedAge.classList.remove("selected");
      selectedAge = null;
    }

    updateStepIndicator(1);

    relationshipGrid.innerHTML = "";
    initRelationshipSelection();
  }

  // Play Again
  function playAgain() {
    closeModal();
  }

  // Event Listeners
  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  playAgainBtn.addEventListener("click", playAgain);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !resultModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Initialize
  initRelationshipSelection();
});