document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const nameModal = document.getElementById("name-modal");
    const welcomeSection = document.getElementById("welcome-section");
    const senderNameInput = document.getElementById("sender-name");
    const confirmNameBtn = document.getElementById("confirm-name-btn");
    const relationshipSelection = document.getElementById("relationship-selection");
    const relationshipGrid = relationshipSelection ? relationshipSelection.querySelector(".grid") : null;
    const ageSelection = document.getElementById("age-selection");
    const ageGrid = ageSelection ? ageSelection.querySelector(".grid") : null;
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
    let scratchCanvas = null;
    const moneyAmount = document.getElementById("money-amount");
    const closeModalBtn = document.getElementById("close-modal");
    const step1Dot = document.getElementById("step1-dot");
    const step2Dot = document.getElementById("step2-dot");
    const step3Dot = document.getElementById("step3-dot");
    const step4Dot = document.getElementById("step4-dot");
    const scrollToRelationship = document.getElementById("scroll-to-relationship");
    const scrollToAge = document.getElementById("scroll-to-age");
    const scrollToHongbao = document.getElementById("scroll-to-hongbao");

    // Lucky Wheel Elements
    const openWheelBtn = document.getElementById("open-wheel-btn");
    const wheelModal = document.getElementById("wheel-modal");
    const closeWheelModal = document.getElementById("close-wheel-modal");
    const wheelCanvas = document.getElementById("wheel-canvas");
    const spinWheelBtn = document.getElementById("spin-wheel-btn");
    const wheelResult = document.getElementById("wheel-result");
    const wheelPrize = document.getElementById("wheel-prize");
    const wheelMessage = document.getElementById("wheel-message");

    // Variables
    let senderName = "";
    let selectedRelationship = null;
    let selectedAge = null;
    let selectedHongbao = null;
    let isRolling = false;
    let isScratching = false;
    let ctx = null;
    let currentAmount = 0;
    let selectedRelationshipId = "";
    let selectedAgeId = "";
    let scratchPoints = [];
    let wheelCtx = null;
    let isSpinning = false;
    let currentRotation = 0;

    // Relationships (8 options)
    const relationships = [
        { id: "grandparents", name: "Ông Bà", icon: "fa-solid fa-person-cane", formal: "Kính gửi Ông Bà" },
        { id: "parents", name: "Bố Mẹ", icon: "fa-solid fa-house-user", formal: "Kính gửi Bố Mẹ" },
        { id: "children", name: "Con Cái", icon: "fa-solid fa-children", formal: "Gửi các con yêu" },
        { id: "siblings", name: "Anh Chị Em", icon: "fa-solid fa-people-group", formal: "Gửi anh/chị/em" },
        { id: "aunt_uncle", name: "Cô Dì Chú Bác", icon: "fa-solid fa-people-roof", formal: "Kính gửi Cô/Dì/Chú/Bác" },
        { id: "friends", name: "Bạn Bè", icon: "fa-solid fa-user-group", formal: "Gửi bạn thân" },
        { id: "colleagues", name: "Đồng Nghiệp", icon: "fa-solid fa-handshake", formal: "Gửi đồng nghiệp" },
        { id: "lovers", name: "Người Yêu", icon: "fa-solid fa-heart-circle-plus", formal: "Gửi người yêu dấu" }
    ];

    // Age groups (8 options)
    const ageGroups = [
        { id: "child", name: "Trẻ Em", range: "1-12 tuổi", icon: "fa-solid fa-child-reaching" },
        { id: "teen", name: "Thiếu Niên", range: "13-17 tuổi", icon: "fa-solid fa-graduation-cap" },
        { id: "young_adult", name: "Thanh Niên", range: "18-25 tuổi", icon: "fa-solid fa-person-running" },
        { id: "adult", name: "Trưởng Thành", range: "26-40 tuổi", icon: "fa-solid fa-user-tie" },
        { id: "middle_age", name: "Trung Niên", range: "41-55 tuổi", icon: "fa-solid fa-briefcase" },
        { id: "senior", name: "Trung Lão", range: "56-70 tuổi", icon: "fa-solid fa-person-walking-with-cane" },
        { id: "elder", name: "Cao Tuổi", range: "71-85 tuổi", icon: "fa-solid fa-chair" },
        { id: "venerable", name: "Thượng Thọ", range: "86+ tuổi", icon: "fa-solid fa-award" }
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

    // EXPANDED Letter Templates - Much Longer and More Variety
    const letterTemplates = {
        grandparents: [
            `Xuân mới lại về, mang theo bao niềm vui và hy vọng. Nhân dịp năm mới, cháu xin gửi đến Ông Bà lời chúc sức khỏe, an khang và thịnh vượng.<br><br>Chúc Ông Bà luôn dồi dào sức khỏe, tinh thần minh mẫn, và tràn đầy niềm vui trong cuộc sống. Mong rằng năm mới sẽ mang đến nhiều may mắn, thành công và hạnh phúc cho Ông Bà.<br><br>Dù không gian có cách trở nhưng tấm lòng và tình cảm luôn hướng về Ông Bà. Những lời dạy bảo của Ông Bà là kim chỉ nam quý giá nhất cho cháu trong cuộc đời. Cháu luôn ghi nhớ ơn Ông Bà đã nuôi nấng, chăm sóc gia đình chúng cháu.<br><br>Năm mới này, cháu mong Ông Bà được khỏe mạnh để chứng kiến con cháu sum vầy, hạnh phúc. Gia đình là nơi cháu tìm thấy sự ấm áp nhất, và Ông Bà chính là trụ cột vững chắc của gia đình.<br><br>Cháu xin chúc Ông Bà tuổi thọ vô cương, phúc lộc tràn đầy, an khang thịnh vượng trong suốt năm mới. Mong Ông Bà luôn mỉm cười, vui vẻ bên con cháu.`,

            `Kính gửi Ông Bà,<br><br>Xuân về mang theo niềm vui mới, cháu xin gửi lời chúc đến Ông Bà. Chúc Ông Bà năm mới sức khỏe dồi dào, tuổi thọ như đá Sơn Tinh, phúc như Đông Hải.<br><br>Mong Ông Bà luôn vui vẻ, an lạc bên con cháu. Cháu biết rằng sự bình an của Ông Bà chính là hạnh phúc lớn nhất của gia đình. Từng bước chân của Ông Bà đã dựng nên mái ấm gia đình, từng lời dạy đã chỉ cho chúng cháu con đường đúng đắn.<br><br>Cháu còn nhớ những câu chuyện Ông Bà kể về thuở xưa, về những gian khó mà gia đình đã vượt qua. Những bài học ấy giúp cháu trân trọng cuộc sống hơn, biết yêu thương người thân hơn.<br><br>Năm mới, cháu chúc Ông Bà luôn được bình an, mạnh khỏe. Chúc Ông Bà có thêm nhiều niềm vui bên con cháu, được hưởng trọn vẹn hạnh phúc tuổi già. Cháu sẽ cố gắng học tập, làm việc tốt để không phụ lòng Ông Bà.<br><br>Kính chúc Ông Bà một năm mới thật nhiều sức khỏe, niềm vui và may mắn!`,

            `Thưa Ông Bà,<br><br>Tết đến xuân về, cháu xin kính chúc Ông Bà vạn sự như ý. Mong Ông Bà luôn mạnh khỏe, sống lâu trăm tuổi để chứng kiến con cháu khôn lớn, thành đạt.<br><br>Những lời dạy của Ông Bà là hành trang quý báu nhất cho cuộc đời cháu. Từng câu chuyện, từng lời khuyên đều in sâu trong lòng cháu. Cháu sẽ cố gắng học tập, rèn luyện để không phụ lòng Ông Bà.<br><br>Mỗi dịp Tết đến, cháu lại nhớ về những kỷ niệm đẹp bên Ông Bà. Những buổi chiều ngồi nghe Ông kể chuyện xưa, những bữa cơm sum vầy có Bà nấu nướng. Đó là những kỷ niệm mà cháu sẽ luôn trân trọng suốt đời.<br><br>Năm mới này, cháu chúc gia đình luôn sum vầy, ấm áp. Chúc Ông Bà được hưởng trọn vẹn niềm vui bên con cháu, được sống trong sự an lành và hạnh phúc. Sức khỏe của Ông Bà chính là phúc lành lớn nhất cho cả gia đình.<br><br>Cháu kính chúc Ông Bà năm mới an khang, thịnh vượng, vạn sự như ý!`
        ],

        parents: [
            `Gửi Bố Mẹ yêu quý,<br><br>Xuân mới lại về, con xin gửi đến Bố Mẹ những lời chúc tốt đẹp nhất. Chúc Bố Mẹ năm mới thật nhiều sức khỏe, luôn vui vẻ và hạnh phúc.<br><br>Cảm ơn Bố Mẹ đã luôn yêu thương, chăm sóc và dạy dỗ con nên người. Mỗi dịp Tết đến, con lại nhớ về những kỷ niệm đẹp bên gia đình. Từ những buổi sáng thức dậy với mùi bánh chưng, đến những buổi tối sum họp quanh mâm cơm gia đình.<br><br>Con biết Bố Mẹ đã vất vả nuôi con khôn lớn. Mỗi sợi tóc bạc của Bố Mẹ là tình yêu thương dành cho con. Con hứa sẽ cố gắng học tập và làm việc thật tốt để không phụ lòng Bố Mẹ.<br><br>Năm mới, con chúc Bố Mẹ luôn khỏe mạnh, công việc thuận lợi, tài lộc đầy nhà. Chúc gia đình mình luôn sum vầy, ấm áp và hạnh phúc. Con yêu Bố Mẹ rất nhiều!<br><br>Con chúc Bố Mẹ một năm mới tràn đầy niềm vui, sức khỏe và thành công!`,

            `Kính gửi Bố Mẹ,<br><br>Năm mới đến, con xin chúc Bố Mẹ sức khỏe dồi dào, công việc thuận lợi, tài lộc đầy nhà. Bố Mẹ là điểm tựa vững chắc nhất của con trong cuộc đời này.<br><br>Con biết Bố Mẹ đã hy sinh rất nhiều để nuôi con ăn học. Những đêm Mẹ thức trắng chăm con ốm, những ngày Bố làm việc vất vả để kiếm tiền nuôi gia đình. Tất cả đều in sâu trong trái tim con.<br><br>Mỗi thành công của con đều có công lao to lớn của Bố Mẹ. Con sẽ cố gắng để Bố Mẹ tự hào, để Bố Mẹ thấy rằng công sức bỏ ra không uổng phí.<br><br>Năm mới này, con mong Bố Mẹ luôn được khỏe mạnh, vui vẻ. Chúc Bố có thêm nhiều thành công trong công việc, chúc Mẹ luôn xinh đẹp và trẻ trung. Chúc gia đình mình luôn sum vầy, hạnh phúc bên nhau.<br><br>Con yêu Bố Mẹ rất nhiều. Chúc Bố Mẹ năm mới an khang, hạnh phúc bên con cháu!`,

            `Gửi Bố Mẹ thân yêu,<br><br>Xuân sang, con gửi đến Bố Mẹ lời chúc năm mới an khang, thịnh vượng. Chúc Bố Mẹ luôn khỏe mạnh, vui vẻ để cùng con đón nhận những điều tốt đẹp năm mới mang lại.<br><br>Con biết ơn Bố Mẹ đã dành cả cuộc đời để nuôi dạy con. Những hy sinh thầm lặng, những lo toan không ngừng nghỉ, tất cả đều vì con. Con sẽ luôn ghi nhớ ơn đức sinh thành của Bố Mẹ.<br><br>Dù cuộc sống có bận rộn đến đâu, con vẫn luôn nhớ về mái nhà ấm áp với Bố Mẹ. Nhớ tiếng cười của Mẹ, nhớ lời dạy bảo của Bố. Đó là nguồn động lực lớn nhất giúp con vượt qua mọi khó khăn.<br><br>Năm mới, con chúc Bố Mẹ sức khỏe dồi dào, công việc hanh thông, gia đạo an khang. Chúc Bố Mẹ được hưởng trọn vẹn niềm vui bên con cháu, được sống trong hạnh phúc và bình an.<br><br>Con yêu Bố Mẹ và mãi mãi biết ơn Bố Mẹ!`
        ],

        children: [
            `Gửi các con yêu quý,<br><br>Năm mới đến, ba/mẹ gửi đến các con lời chúc tốt đẹp nhất. Chúc các con luôn khỏe mạnh, vui vẻ và học hành chăm ngoan.<br><br>Ba/mẹ rất tự hào về các con, những đứa trẻ ngoan ngoãn và hiếu thảo. Mong rằng năm mới sẽ mang đến cho các con thật nhiều niềm vui và kỷ niệm đẹp.<br><br>Hãy luôn giữ cho mình trái tim ấm áp và tinh thần lạc quan. Dù cuộc sống có khó khăn đến đâu, hãy nhớ rằng ba/mẹ luôn bên cạnh các con. Gia đình là nơi các con luôn có thể trở về.<br><br>Ba/mẹ mong các con học tập thật tốt, phát triển toàn diện cả về học vấn lẫn đạo đức. Hãy trở thành những người con hiếu thảo, những công dân tốt của đất nước.<br><br>Chúc các con năm mới nhiều niềm vui, luôn khỏe mạnh và gặp nhiều may mắn. Ba/mẹ yêu các con rất nhiều!`
        ],

        siblings: [
            `Gửi anh/chị/em thân yêu,<br><br>Xuân về với muôn vàn niềm vui, anh/chị/em gửi lời chúc năm mới an khang, thịnh vượng. Chúc mình luôn khỏe mạnh, thành công trong công việc và hạnh phúc trong cuộc sống.<br><br>Những kỷ niệm tuổi thơ bên nhau là kho báu quý giá mà không gì có thể thay thế. Từ những trò chơi ngày bé, những lần cùng nhau vượt qua khó khăn, đến những niềm vui được chia sẻ cùng nhau.<br><br>Dù cuộc sống có bận rộn, tình anh em mãi trong tim. Mình luôn là chỗ dựa vững chắc cho nhau, là người hiểu mình nhất trên đời này.<br><br>Năm mới, chúc anh/chị/em công việc thuận lợi, gia đình hạnh phúc, tài lộc dồi dào. Chúc năm mới này đem đến nhiều điều tốt đẹp cho gia đình mình!<br><br>Luôn nhớ mình và mong sớm được gặp lại!`
        ],

        friends: [
            `Gửi bạn thân yêu,<br><br>Năm mới đến rồi! Chúc bạn một năm tràn đầy sức khỏe, thành công và hạnh phúc. Tình bạn của chúng ta là món quà quý giá mà mình trân trọng nhất.<br><br>Cảm ơn bạn đã luôn bên cạnh, chia sẻ trong những lúc vui buồn. Từ những buổi trò chuyện đêm khuya, những chuyến đi chơi vui vẻ, đến những lúc khó khăn có nhau động viên.<br><br>Bạn là người bạn tuyệt vời nhất mà mình từng có. Hy vọng tình bạn của chúng ta sẽ mãi bền vững, vượt qua mọi thử thách của thời gian.<br><br>Năm mới, mình chúc bạn đạt được tất cả những mục tiêu đã đề ra. Chúc bạn luôn vui vẻ, may mắn và gặp nhiều điều tốt lành. Mong năm mới sẽ có thêm nhiều kỷ niệm đẹp cho đôi ta.<br><br>Chúc bạn luôn vui vẻ và thành công trong mọi việc!`
        ],

        colleagues: [
            `Gửi đồng nghiệp thân mến,<br><br>Nhân dịp năm mới, xin chúc anh/chị/bạn sức khỏe dồi dào, công việc thăng tiến, gia đình hạnh phúc. Được làm việc cùng là niềm vui lớn và cũng là cơ hội để mình học hỏi rất nhiều.<br><br>Cảm ơn anh/chị/bạn đã luôn hỗ trợ, giúp đỡ trong công việc. Những kinh nghiệm quý báu mà anh/chị/bạn chia sẻ đã giúp mình trưởng thành rất nhiều trong nghề nghiệp.<br><br>Mong rằng năm mới, chúng ta sẽ tiếp tục hợp tác tốt đẹp, cùng nhau đạt được nhiều thành công hơn nữa. Chúc cả team luôn đoàn kết, vượt qua mọi thử thách để đạt được những mục tiêu cao hơn.<br><br>Chúc anh/chị/bạn năm mới an khang, thịnh vượng, sự nghiệp phát đạt. Chúc mừng năm mới!`
        ],

        aunt_uncle: [
            `Kính gửi Cô/Dì/Chú/Bác,<br><br>Xuân về, cháu xin kính chúc Cô/Dì/Chú/Bác sức khỏe dồi dào, gia đình hạnh phúc, công việc thuận lợi. Tình cảm của Cô/Dì/Chú/Bác dành cho cháu thật ấm áp và trân quý.<br><br>Cháu còn nhớ những lần Cô/Dì/Chú/Bác quan tâm, chăm sóc cháu như con đẻ. Những lời khuyên, sự động viên của Cô/Dì/Chú/Bác đã giúp cháu vượt qua nhiều khó khăn trong cuộc sống.<br><br>Mong năm mới mang đến nhiều niềm vui, thành công cho gia đình Cô/Dì/Chú/Bác. Cháu luôn biết ơn sự quan tâm và yêu thương mà Cô/Dì/Chú/Bác dành cho cháu.<br><br>Cháu xin kính chúc Cô/Dì/Chú/Bác một năm mới an khang, thịnh vượng, vạn sự như ý. Chúc cả gia đình luôn sum vầy, hạnh phúc!`
        ],

        lovers: [
            `Gửi người yêu dấu,<br><br>Xuân về, anh/em xin gửi đến em/anh lời chúc ngọt ngào nhất. Chúc chúng ta một năm mới tràn đầy hạnh phúc, tình yêu thắm thiết và luôn bên nhau vượt qua mọi thử thách.<br><br>Em/anh là ánh sáng trong cuộc đời anh/em, là động lực để anh/em cố gắng mỗi ngày. Mỗi khoảnh khắc bên em/anh đều là những kỷ niệm đẹp mà anh/em trân trọng.<br><br>Mong rằng năm mới, chúng ta sẽ có thêm nhiều kỷ niệm đẹp, cùng nhau đi đến những nơi mới, trải nghiệm những điều mới mẻ. Anh/em hứa sẽ luôn yêu thương, chăm sóc em/anh như hiện tại, thậm chí còn hơn thế nữa.<br><br>Chúc em/anh luôn xinh đẹp/đẹp trai, khỏe mạnh và thành công. Chúc tình yêu của chúng ta mãi mãi bền vững, vượt qua mọi sóng gió cuộc đời.<br><br>Anh/em yêu em/anh rất nhiều và mãi mãi như vậy!`
        ]
    };

    // Wheel Prize Configuration - 15 items (12 money + 3 miss)
    const wheelPrizes = [
        { text: "200.000₫", amount: 200000, color: "#FFD700", probability: 3, icon: "💰" },
        { text: "100.000₫", amount: 100000, color: "#FF6B6B", probability: 5, icon: "💵" },
        { text: "Trượt rồi!", amount: 0, color: "#6B7280", probability: 8, icon: "😢" },
        { text: "50.000₫", amount: 50000, color: "#4ECDC4", probability: 8, icon: "💸" },
        { text: "20.000₫", amount: 20000, color: "#95E1D3", probability: 10, icon: "💴" },
        { text: "Trượt rồi!", amount: 0, color: "#6B7280", probability: 8, icon: "😭" },
        { text: "10.000₫", amount: 10000, color: "#F38181", probability: 12, icon: "💶" },
        { text: "5.000₫", amount: 5000, color: "#AA96DA", probability: 10, icon: "💷" },
        { text: "Trượt rồi!", amount: 0, color: "#6B7280", probability: 8, icon: "😔" },
        { text: "50.000₫", amount: 50000, color: "#4ECDC4", probability: 8, icon: "💸" },
        { text: "20.000₫", amount: 20000, color: "#95E1D3", probability: 10, icon: "💴" },
        { text: "10.000₫", amount: 10000, color: "#F38181", probability: 12, icon: "💶" },
        { text: "100.000₫", amount: 100000, color: "#FF6B6B", probability: 5, icon: "💵" },
        { text: "5.000₫", amount: 5000, color: "#AA96DA", probability: 10, icon: "💷" },
        { text: "2.000₫", amount: 2000, color: "#C7CEEA", probability: 8, icon: "💳" }
    ];

    // Update Step Indicator
    function updateStepIndicator(currentStep) {
        if (step1Dot) step1Dot.classList.remove("completed", "active");
        if (step2Dot) step2Dot.classList.remove("completed", "active");
        if (step3Dot) step3Dot.classList.remove("completed", "active");
        if (step4Dot) step4Dot.classList.remove("completed", "active");

        if (currentStep === 1 && step1Dot) {
            step1Dot.classList.add("active");
        } else if (currentStep === 2) {
            if (step1Dot) step1Dot.classList.add("completed");
            if (step2Dot) step2Dot.classList.add("active");
        } else if (currentStep === 3) {
            if (step1Dot) step1Dot.classList.add("completed");
            if (step2Dot) step2Dot.classList.add("completed");
            if (step3Dot) step3Dot.classList.add("active");
        } else if (currentStep === 4) {
            if (step1Dot) step1Dot.classList.add("completed");
            if (step2Dot) step2Dot.classList.add("completed");
            if (step3Dot) step3Dot.classList.add("completed");
            if (step4Dot) step4Dot.classList.add("active");
        }
    }

    // Name Input Handler
    const minimizeNameBtn = document.getElementById("minimize-name-btn");
    const nameMinimized = document.getElementById("name-minimized");
    const nameExpanded = document.getElementById("name-expanded");

    if (senderNameInput) {
        senderNameInput.addEventListener("input", function () {
            if (confirmNameBtn) {
                confirmNameBtn.disabled = this.value.trim().length === 0;
            }
        });

        // Allow Enter key to submit
        senderNameInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter" && this.value.trim().length > 0) {
                confirmNameBtn.click();
            }
        });
    }

    // Minimize button
    if (minimizeNameBtn) {
        minimizeNameBtn.addEventListener("click", function () {
            if (nameExpanded) nameExpanded.classList.add("hidden");
            if (nameMinimized) nameMinimized.classList.remove("hidden");
        });
    }

    // Maximize button (click on minimized version)
    if (nameMinimized) {
        nameMinimized.addEventListener("click", function () {
            if (nameExpanded) nameExpanded.classList.remove("hidden");
            if (nameMinimized) nameMinimized.classList.add("hidden");
            setTimeout(() => {
                if (senderNameInput) senderNameInput.focus();
            }, 100);
        });
    }

    if (confirmNameBtn) {
        confirmNameBtn.addEventListener("click", function () {
            const name = senderNameInput.value.trim();
            if (name) {
                senderName = name;
                hideNameModal();
            }
        });
    }

    function hideNameModal() {
        // Hide entire name modal
        if (nameModal) {
            nameModal.classList.add("animate-slideOutLeft");
            setTimeout(() => {
                nameModal.classList.add("hidden");
                nameModal.classList.remove("animate-slideOutLeft");
            }, 300);
        }

        updateStepIndicator(2);

        setTimeout(() => {
            if (welcomeSection) welcomeSection.classList.add("hidden");
            initRelationshipSelection();
            if (relationshipSelection) relationshipSelection.classList.remove("hidden");
            if (relationshipSelection) relationshipSelection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
    }

    // Initialize Relationship Selection
    function initRelationshipSelection() {
        if (!relationshipGrid) return;
        relationshipGrid.innerHTML = "";

        relationships.forEach((relationship) => {
            const card = document.createElement("div");
            card.className = "selection-card rounded-xl p-4 text-center cursor-pointer h-full";
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

                document.querySelectorAll("#relationship-selection .selection-card").forEach((c) => {
                    c.classList.remove("selected");
                });

                selectedRelationship = this;
                selectedRelationshipId = relationship.id;
                this.classList.add("selected");

                // Skip age selection for lovers
                if (relationship.id === "lovers") {
                    updateStepIndicator(4);
                    if (scrollToHongbao) scrollToHongbao.classList.remove("hidden");

                    setTimeout(() => {
                        createHongbaos();
                        if (hongbaoSelection) hongbaoSelection.classList.remove("hidden");
                        if (hongbaoSelection) hongbaoSelection.scrollIntoView({ behavior: "smooth", block: "start" });

                        setTimeout(() => {
                            if (scrollToHongbao) scrollToHongbao.classList.add("hidden");
                        }, 1000);
                    }, 300);
                } else {
                    updateStepIndicator(3);
                    if (scrollToAge) scrollToAge.classList.remove("hidden");

                    setTimeout(() => {
                        initAgeSelection();
                        if (ageSelection) ageSelection.classList.remove("hidden");
                        if (ageSelection) ageSelection.scrollIntoView({ behavior: "smooth", block: "start" });

                        setTimeout(() => {
                            if (scrollToAge) scrollToAge.classList.add("hidden");
                        }, 1000);
                    }, 300);
                }
            });

            relationshipGrid.appendChild(card);
        });
    }

    // Initialize Age Selection
    function initAgeSelection() {
        if (!ageGrid) return;
        ageGrid.innerHTML = "";

        ageGroups.forEach((age) => {
            const card = document.createElement("div");
            card.className = "selection-card rounded-xl p-4 text-center cursor-pointer h-full";
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

                document.querySelectorAll("#age-selection .selection-card").forEach((c) => {
                    c.classList.remove("selected");
                });

                selectedAge = this;
                selectedAgeId = age.id;
                this.classList.add("selected");

                updateStepIndicator(4);
                if (scrollToHongbao) scrollToHongbao.classList.remove("hidden");

                setTimeout(() => {
                    createHongbaos();
                    if (hongbaoSelection) hongbaoSelection.classList.remove("hidden");
                    if (hongbaoSelection) hongbaoSelection.scrollIntoView({ behavior: "smooth", block: "start" });

                    setTimeout(() => {
                        if (scrollToHongbao) scrollToHongbao.classList.add("hidden");
                    }, 1000);
                }, 300);
            });

            ageGrid.appendChild(card);
        });
    }

    // Get Random Amount with weighted probabilities based on relationship
    function getRandomAmount() {
        const random = Math.random() * 100;

        // Special relationships get better amounts
        const isSpecial = ["grandparents", "parents", "lovers"].includes(selectedRelationshipId);

        if (isSpecial) {
            // Better distribution for special relationships
            if (random < 8) {
                return 200000;
            } else if (random < 20) {
                return 100000;
            } else if (random < 40) {
                return 50000;
            } else if (random < 65) {
                return 20000;
            } else if (random < 85) {
                return 10000;
            } else if (random < 95) {
                return 5000;
            } else {
                return 2000;
            }
        } else {
            // Regular distribution for other relationships
            if (random < 5) {
                return 200000;
            } else if (random < 15) {
                return 100000;
            } else if (random < 30) {
                return 50000;
            } else if (random < 60) {
                return 20000;
            } else if (random < 80) {
                return 10000;
            } else if (random < 90) {
                return 5000;
            } else if (random < 95) {
                return 2000;
            } else {
                return 1000;
            }
        }
    }

    // Format Currency
    function formatCurrency(amount) {
        return amount.toLocaleString("vi-VN") + " ₫";
    }

    // Create 24 Hongbaos
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

    // Show Result Modal
    function showResultModal(selectedId) {
        if (diceSection) diceSection.classList.remove("hidden");
        if (letterScratchSection) letterScratchSection.classList.add("hidden");

        if (resultModal) resultModal.classList.remove("hidden");
        if (modalOverlay) modalOverlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";

        startDiceRolling(selectedId);
    }

    // Start Dice Rolling
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

    // Generate Letter
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

    // Stop Dice Rolling
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

    // Show Letter and Scratch
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

    // Initialize Scratch Card
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

        if (!skipCheck) {
            checkScratchCompletion();
        }
    }

    function checkScratchCompletion() {
        if (!ctx || !scratchCanvas) return;

        const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imageData.data;
        let transparentCount = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) {
                transparentCount++;
            }
        }

        const totalPixels = pixels.length / 4;
        const scratchedPercent = (transparentCount / totalPixels) * 100;
    }

    // Lucky Wheel Functions
    function drawWheel() {
        if (!wheelCanvas || !wheelCtx) return;

        const centerX = wheelCanvas.width / 2;
        const centerY = wheelCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

        // Draw outer glow
        wheelCtx.save();
        wheelCtx.shadowColor = "rgba(251, 191, 36, 0.5)";
        wheelCtx.shadowBlur = 30;
        wheelCtx.beginPath();
        wheelCtx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
        wheelCtx.strokeStyle = "#fbbf24";
        wheelCtx.lineWidth = 3;
        wheelCtx.stroke();
        wheelCtx.restore();

        // Draw wheel segments
        let startAngle = currentRotation;
        const anglePerSlice = (2 * Math.PI) / wheelPrizes.length;

        wheelPrizes.forEach((prize, index) => {
            const endAngle = startAngle + anglePerSlice;

            // Draw segment with gradient
            const gradient = wheelCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            const color1 = prize.color;
            const color2 = adjustBrightness(prize.color, -20);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);

            wheelCtx.beginPath();
            wheelCtx.moveTo(centerX, centerY);
            wheelCtx.arc(centerX, centerY, radius, startAngle, endAngle);
            wheelCtx.closePath();
            wheelCtx.fillStyle = gradient;
            wheelCtx.fill();

            // Draw segment border
            wheelCtx.strokeStyle = "#fff";
            wheelCtx.lineWidth = 3;
            wheelCtx.stroke();

            // Draw text
            wheelCtx.save();
            wheelCtx.translate(centerX, centerY);
            wheelCtx.rotate(startAngle + anglePerSlice / 2);
            wheelCtx.textAlign = "center";
            wheelCtx.textBaseline = "middle";

            // Text shadow for better readability
            wheelCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
            wheelCtx.shadowBlur = 4;
            wheelCtx.shadowOffsetX = 2;
            wheelCtx.shadowOffsetY = 2;

            wheelCtx.font = "bold 18px 'Montserrat', sans-serif";
            wheelCtx.fillStyle = "#fff";
            wheelCtx.fillText(prize.text, radius * 0.65, 0);
            wheelCtx.restore();

            startAngle = endAngle;
        });

        // Draw outer ring
        wheelCtx.beginPath();
        wheelCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        wheelCtx.strokeStyle = "#fbbf24";
        wheelCtx.lineWidth = 8;
        wheelCtx.stroke();

        // Draw decorative dots on outer ring
        const dotCount = 24;
        for (let i = 0; i < dotCount; i++) {
            const angle = (i / dotCount) * Math.PI * 2;
            const dotX = centerX + Math.cos(angle) * (radius + 4);
            const dotY = centerY + Math.sin(angle) * (radius + 4);

            wheelCtx.beginPath();
            wheelCtx.arc(dotX, dotY, 4, 0, 2 * Math.PI);
            wheelCtx.fillStyle = i % 2 === 0 ? "#fbbf24" : "#ef4444";
            wheelCtx.fill();
        }
    }

    function adjustBrightness(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    function spinWheel() {
        if (isSpinning) return;

        isSpinning = true;
        if (wheelResult) wheelResult.classList.add("hidden");

        // Add spinning class for visual effects
        if (wheelCanvas) wheelCanvas.classList.add("spinning");

        const selectedPrize = getWeightedRandomPrize();
        const prizeIndex = wheelPrizes.indexOf(selectedPrize);

        // Calculate target rotation (multiple full spins + landing position)
        const fullSpins = 5 + Math.random() * 2; // 5-7 full rotations
        const anglePerSlice = (Math.PI * 2) / wheelPrizes.length;
        const targetAngle = prizeIndex * anglePerSlice + anglePerSlice / 2;
        const targetRotation = (Math.PI * 2 * fullSpins) - targetAngle + (Math.PI / 2);

        const duration = 5000; // 5 seconds
        const startTime = Date.now();
        const startRotation = currentRotation;

        function animate() {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 4);
            currentRotation = startRotation + targetRotation * easeOut;

            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentRotation = currentRotation % (Math.PI * 2);
                isSpinning = false;
                if (wheelCanvas) wheelCanvas.classList.remove("spinning");

                // Small bounce effect at the end
                bounceWheel(() => {
                    showWheelResult(selectedPrize);
                });
            }
        }

        animate();
    }

    function bounceWheel(callback) {
        const bounceAmount = 0.1;
        const bounceDuration = 200;
        const startTime = Date.now();
        const startRotation = currentRotation;

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / bounceDuration;

            if (progress < 0.5) {
                currentRotation = startRotation + bounceAmount * Math.sin(progress * Math.PI * 2);
            } else {
                currentRotation = startRotation + bounceAmount * Math.sin((1 - progress) * Math.PI * 2);
            }

            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentRotation = startRotation;
                drawWheel();
                callback();
            }
        }

        animate();
    }

    function getWeightedRandomPrize() {
        const totalProbability = wheelPrizes.reduce((sum, prize) => sum + prize.probability, 0);
        let random = Math.random() * totalProbability;

        for (const prize of wheelPrizes) {
            random -= prize.probability;
            if (random <= 0) {
                return prize;
            }
        }

        return wheelPrizes[wheelPrizes.length - 1];
    }

    function showWheelResult(prize) {
        const resultIcon = document.getElementById("result-icon");
        if (wheelPrize) wheelPrize.textContent = prize.text;
        if (resultIcon) resultIcon.textContent = prize.icon || (prize.amount > 0 ? "🎉" : "😢");

        if (wheelMessage) {
            if (prize.amount > 0) {
                const messages = [
                    "Xuân an vui, Tết hạnh phúc!",
                    "Chúc mừng bạn!",
                    "May mắn đến rồi!",
                    "Phát tài phát lộc!",
                    "Tài lộc dồi dào!"
                ];
                wheelMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
            } else {
                wheelMessage.textContent = "Đừng bỏ cuộc! Thử lại nhé! 💪";
            }
        }
        if (wheelResult) wheelResult.classList.remove("hidden");
    }

    // Close Modal Functions
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

        if (hongbaoSelection) hongbaoSelection.classList.add("hidden");
        if (ageSelection) ageSelection.classList.add("hidden");
        if (relationshipSelection) relationshipSelection.classList.add("hidden");
        if (welcomeSection) welcomeSection.classList.remove("hidden");

        if (selectedRelationship) {
            selectedRelationship.classList.remove("selected");
            selectedRelationship = null;
        }
        if (selectedAge) {
            selectedAge.classList.remove("selected");
            selectedAge = null;
        }

        // Reset name and show modal again
        senderName = "";
        if (senderNameInput) senderNameInput.value = "";
        if (nameModal) {
            nameModal.classList.remove("hidden", "animate-slideOutLeft");
            // Show expanded by default
            if (nameExpanded) nameExpanded.classList.remove("hidden");
            if (nameMinimized) nameMinimized.classList.add("hidden");
        }

        updateStepIndicator(1);
        if (relationshipGrid) relationshipGrid.innerHTML = "";
    }

    function closeWheelModalFunc() {
        if (wheelModal) wheelModal.classList.add("hidden");
        if (modalOverlay) modalOverlay.classList.add("hidden");
        document.body.style.overflow = "auto";
        if (wheelResult) wheelResult.classList.add("hidden");
    }

    // Event Listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay) {
                if (!resultModal.classList.contains("hidden")) {
                    closeModal();
                }
                if (!wheelModal.classList.contains("hidden")) {
                    closeWheelModalFunc();
                }
            }
        });
    }

    if (openWheelBtn) {
        openWheelBtn.addEventListener("click", function () {
            if (wheelModal) wheelModal.classList.remove("hidden");
            if (modalOverlay) modalOverlay.classList.remove("hidden");
            document.body.style.overflow = "hidden";

            if (wheelCanvas) {
                wheelCtx = wheelCanvas.getContext("2d");
                currentRotation = 0;
                drawWheel();
            }
        });
    }

    if (closeWheelModal) {
        closeWheelModal.addEventListener("click", closeWheelModalFunc);
    }

    // Add center button spin functionality
    const spinBtnCenter = document.getElementById("spin-btn-center");
    if (spinBtnCenter) {
        spinBtnCenter.addEventListener("click", function (e) {
            e.stopPropagation();
            spinWheel();
        });
    }

    // Add canvas click to spin
    if (wheelCanvas) {
        wheelCanvas.addEventListener("click", function () {
            if (!isSpinning) {
                spinWheel();
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (resultModal && !resultModal.classList.contains("hidden")) {
                closeModal();
            }
            if (wheelModal && !wheelModal.classList.contains("hidden")) {
                closeWheelModalFunc();
            }
        }
    });

    // Initialize - Show name modal on load
    updateStepIndicator(1);

    // Auto-focus on name input when modal is visible
    setTimeout(() => {
        if (senderNameInput && nameModal && !nameModal.classList.contains("hidden")) {
            senderNameInput.focus();
        }
    }, 500);
});