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
        // Ông Bà - trang trọng, kính trọng, ấm áp
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

            `Thưa Ông Bà,<br><br>
            Xuân sang, đất trời đổi mới, lòng người cũng thêm rộn ràng và ấm áp.<br>
            Nhân dịp năm mới, cháu xin kính chúc Ông Bà tuổi mới thêm xuân, sức khỏe dồi dào, phúc lộc đầy nhà, cuộc sống luôn an yên và thuận hòa.<br><br>
            Mong rằng mỗi sớm mai thức dậy, Ông Bà đều cảm nhận được sự bình an trong tâm hồn,<br>
            mỗi ngày trôi qua đều nhẹ nhàng, thư thái, tràn đầy niềm vui giản dị bên con cháu.<br><br>
            Cháu mong Ông Bà luôn giữ được nụ cười hiền từ, ánh mắt ấm áp và sự minh mẫn như hiện tại,<br>
            để mãi là chỗ dựa yêu thương, là bóng mát bình yên cho cả gia đình.`,


            `Ông Bà yêu quý,<br><br>
            Năm mới về trong không khí sum vầy và ấm áp, cháu xin gửi đến Ông Bà những lời chúc chân thành và yêu thương nhất.<br>
            Cháu kính chúc Ông Bà thật nhiều phúc thọ, an khang, thịnh vượng, cuộc sống luôn đủ đầy và an vui mỗi ngày.<br><br>
            Dù sau này cháu có đi xa đến đâu, bận rộn đến nhường nào,<br>
            trái tim cháu vẫn luôn hướng về Ông Bà với tất cả sự kính trọng, biết ơn và yêu thương sâu sắc.<br><br>
            Cháu cảm ơn Ông Bà vì đã luôn âm thầm hy sinh, chở che và dành cho cháu những điều tốt đẹp nhất trong cuộc đời.`,

            `Kính gửi Ông Bà,<br><br>
            Khi năm mới gõ cửa, cháu xin kính chúc Ông Bà sức khỏe dồi dào như suối nguồn không cạn,<br>
            tinh thần luôn an nhiên, thư thái giữa những tháng ngày bình dị.<br><br>
            Cháu cầu mong Ông Bà luôn có hạnh phúc viên mãn như trăng rằm tròn đầy,<br>
            cuộc sống nhẹ nhàng, yên ấm và tuổi thọ trăm năm trong bình an, phúc lộc.<br><br>
            Cháu mong sớm được trở về quây quần bên Ông Bà,<br>
            cùng nhau đón những ngày Tết ấm áp, sum vầy, chan chứa tiếng cười yêu thương.`,

            `Thưa Ông Bà kính mến,<br><br>
            Nhân dịp năm mới, cháu xin kính chúc Ông Bà một năm tràn đầy sức sống,<br>
            tinh thần luôn lạc quan, vui vẻ và an yên trong từng khoảnh khắc thường ngày.<br><br>
            Mong rằng Ông Bà lúc nào cũng được con cháu vây quanh yêu thương,<br>
            được quan tâm, chăm sóc và sẻ chia trong không khí gia đình đầm ấm.<br><br>
            Đối với cháu, Ông Bà luôn là người thân yêu nhất,<br>
            là nơi để cháu nhớ về, yêu thương và trân trọng suốt cuộc đời.<br><br>
            Cháu yêu Ông Bà rất nhiều và luôn mong Ông Bà mạnh khỏe, hạnh phúc mỗi ngày ạ!`
        ],

        // Bố Mẹ - tình cảm, biết ơn, gần gũi
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

            `Kính gửi Bố Mẹ,<br><br>
            Nhân dịp năm mới, con xin kính chúc Bố Mẹ một năm an khang, thịnh vượng, sức khỏe dồi dào và tinh thần luôn an nhiên.<br>
            Mong rằng mỗi ngày trôi qua đều nhẹ nhàng, bớt lo toan và thêm thật nhiều niềm vui giản dị bên gia đình.<br><br>
            Con cảm ơn Bố Mẹ vì tất cả những hy sinh thầm lặng, những vất vả và yêu thương mà Bố Mẹ đã dành cho con suốt cuộc đời.<br>
            Con luôn ghi nhớ, biết ơn và yêu thương Bố Mẹ nhiều nhất trên đời.`,

            `Bố Mẹ yêu quý,<br><br>
            Con chúc Bố Mẹ năm mới thật nhiều niềm vui, nụ cười luôn nở trên môi và trong lòng lúc nào cũng nhẹ nhõm, bình yên.<br>
            Mong rằng những muộn phiền, lo toan sẽ vơi bớt đi, để mỗi ngày của Bố Mẹ trôi qua đều dễ chịu và thoải mái hơn.<br><br>
            Con chỉ mong Bố Mẹ luôn khỏe mạnh, sống vui và hạnh phúc bên con thật lâu,<br>
            để gia đình mình mãi là nơi ấm áp nhất để con trở về.`,

            `Bố Mẹ kính yêu,<br><br>
            Năm mới con xin chúc Bố Mẹ sức khỏe dồi dào, tinh thần vui vẻ và cuộc sống luôn đủ đầy, sung túc.<br>
            Mong rằng hạnh phúc sẽ luôn hiện hữu trong từng bữa cơm gia đình, từng câu chuyện nhỏ mỗi ngày.<br><br>
            Con biết con còn phải cố gắng rất nhiều,<br>
            nhưng con hứa sẽ nỗ lực từng ngày để sau này có thể chăm lo cho Bố Mẹ thật tốt, thật trọn vẹn ạ.`,

            `Gửi hai người quan trọng nhất đời con,<br><br>
            Nhân dịp năm mới, con xin chúc Bố Mẹ luôn bình an, mạnh khỏe và gặp thật nhiều điều may mắn trong cuộc sống.<br>
            Mong rằng mỗi ngày trôi qua, Bố Mẹ đều cảm thấy yên tâm và tự hào về con.<br><br>
            Dù con có nói bao nhiêu lời đi nữa cũng không thể diễn tả hết tình yêu và sự biết ơn trong lòng con dành cho Bố Mẹ.<br>
            Con yêu Bố Mẹ rất nhiều, nhiều hơn tất cả những gì con có thể nói thành lời.`,

            `Bố Mẹ ơi,<br><br>
            Năm mới lại đến rồi, con chúc Bố Mẹ luôn ăn ngon, ngủ ngon, sức khỏe thật tốt và lúc nào cũng vui vẻ, thoải mái.<br>
            Mong rằng mọi áp lực, mệt mỏi sẽ bớt đi, để Bố Mẹ có thật nhiều thời gian nghỉ ngơi và tận hưởng cuộc sống.<br><br>
            Đối với con, Bố Mẹ luôn là người tuyệt vời nhất trên đời,<br>
            và con sẽ luôn yêu thương, trân trọng Bố Mẹ bằng cả trái tim mình.`
        ],

        // Con cái - yêu thương, động viên, gần gũi
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

            `Gửi các thiên thần nhỏ của ba/mẹ,<br><br>
            Năm mới đến rồi, mang theo bao điều mới mẻ và tươi vui đang chờ các con phía trước.<br>
            Ba/mẹ chúc các con lúc nào cũng cười thật tươi, luôn hồn nhiên, vui vẻ và tràn đầy năng lượng tích cực.<br><br>
            Mong các con ăn ngoan, ngủ ngoan, học giỏi và biết yêu thương, chia sẻ với mọi người xung quanh.<br>
            Các con chính là niềm hạnh phúc lớn nhất trong cuộc đời của ba/mẹ.`,

            `Các con yêu,<br><br>
            Ba/mẹ chúc các con một năm mới tràn đầy năng lượng, tinh thần luôn vui vẻ và khỏe mạnh mỗi ngày.<br>
            Mong rằng việc học tập của các con luôn tiến bộ, ham học hỏi và không ngừng cố gắng.<br><br>
            Gia đình mình sẽ luôn là nơi ấm áp nhất để các con trở về sau mỗi ngày dài.<br>
            Ba/mẹ sẽ luôn đồng hành, động viên và yêu thương các con bằng tất cả những gì ba/mẹ có.`,

            `Các bé cưng của ba/mẹ,<br><br>
            Năm mới đến, ba/mẹ chúc các con ngày càng cao lớn, xinh xắn, thông minh và khỏe mạnh.<br>
            Mong rằng các con luôn ngoan ngoãn, lễ phép, biết quan tâm và yêu thương mọi người xung quanh.<br><br>
            Dù có chuyện gì xảy ra, ba/mẹ vẫn luôn ở bên lắng nghe, che chở và bảo vệ các con.<br>
            Các con hãy cứ yên tâm lớn lên trong tình yêu thương của gia đình nhé!`,

            `Gửi các con trai/con gái yêu dấu của ba/mẹ,<br><br>
            Ba/mẹ chúc các con năm mới gặp thật nhiều điều tốt đẹp trong cuộc sống và trong học tập.<br>
            Mong các con có những người bạn tốt, được thầy cô yêu thương và luôn giữ được nụ cười rạng rỡ trên môi.<br><br>
            Hãy luôn tự tin là chính mình, sống tử tế và biết ơn những điều nhỏ bé xung quanh.<br>
            Ba/mẹ luôn tin tưởng và tự hào về các con.`,

            `Các con yêu dấu,<br><br>
            Bước sang năm mới, ba/mẹ mong các con sẽ tự tin hơn, mạnh mẽ hơn và dũng cảm trước những điều mới mẻ.<br>
            Mong rằng các con luôn nhớ rằng mình được yêu thương, trân trọng và chở che vô điều kiện.<br><br>
            Dù mai này các con có lớn đến đâu, đi xa đến nhường nào,<br>
            ba/mẹ vẫn luôn ở đây, yêu thương các con bằng cả trái tim mình.`
        ],

        // Anh chị em - thân mật, gần gũi, có thể pha chút hài hước
        siblings: [
            `Gửi anh/chị/em thân yêu,<br><br>
            Xuân mới lại về, mang theo nhiều hy vọng và những khởi đầu tốt đẹp.<br>
            Anh/chị/em xin gửi đến mình lời chúc năm mới an khang, thịnh vượng, sức khỏe dồi dào và tinh thần luôn vững vàng.<br><br>
            Mong rằng trong năm mới, mọi dự định đều thuận lợi, mọi cố gắng đều được đền đáp xứng đáng.<br>
            Dù cuộc sống có nhiều thay đổi, tình cảm anh em mình vẫn luôn bền chặt và đáng trân quý.`,

            `Kính gửi anh/chị/em,<br><br>
            Nhân dịp năm mới, anh/chị/em chúc mình luôn mạnh khỏe, bình an và gặp nhiều may mắn trong công việc cũng như cuộc sống.<br>
            Mong rằng mỗi ngày trôi qua đều có thêm niềm vui, sự an tâm và những điều tích cực.<br><br>
            Chúc cho con đường phía trước luôn hanh thông,<br>
            và mọi ước mong tốt đẹp sớm trở thành hiện thực.`,

            `Gửi anh/chị/em yêu quý,<br><br>
            Năm mới sang trang, anh/chị/em chúc mình một năm thật rực rỡ và trọn vẹn.<br>
            Công việc thuận lợi, sự nghiệp vững vàng, tinh thần luôn lạc quan và vui vẻ.<br><br>
            Mong rằng dù mỗi người có những hướng đi riêng,<br>
            chúng ta vẫn luôn dành cho nhau sự quan tâm, sẻ chia và yêu thương chân thành.`,

            `Anh/chị/em thân mến,<br><br>
            Nhân dịp đầu xuân năm mới, chúc em/anh/chị gặp nhiều điều tốt đẹp,<br>
            cuộc sống đủ đầy, tâm an và lòng vững.<br><br>
            Mong rằng những khó khăn của năm cũ sẽ ở lại phía sau,<br>
            để năm mới mở ra nhiều cơ hội, niềm vui và sự bình yên hơn.`,

            `Gửi anh/chị/em trong gia đình,<br><br>
            Năm mới, anh/chị/em xin chúc mình luôn khỏe mạnh, tinh thần minh mẫn và cuộc sống ngày càng ổn định.<br>
            Mong rằng mỗi ngày đều trôi qua nhẹ nhàng, bớt lo toan và thêm nhiều khoảnh khắc đáng quý.<br><br>
            Được là anh em trong cùng một gia đình là điều rất đáng trân trọng,<br>
            và anh/chị/em luôn mong chúng ta sẽ giữ gìn điều đó thật lâu.`,

            `Anh/chị/em yêu quý,<br><br>
            Xuân về mang theo sự sum vầy và hơi ấm gia đình.<br>
            Anh/chị/em chúc mình năm mới bình an, vững vàng trước mọi thử thách và luôn có người thân ở bên khi cần.<br><br>
            Mong rằng tình cảm anh em sẽ luôn là chỗ dựa tinh thần,<br>
            cùng nhau chia sẻ niềm vui, động viên nhau khi khó khăn.`,

            `Gửi anh/chị/em thân thương,<br><br>
            Năm mới đến, chúc mình một năm sống trọn vẹn và ý nghĩa hơn.<br>
            Công việc ổn định, tài chính vững vàng, tinh thần an yên và nụ cười luôn nở.<br><br>
            Dù tương lai có thay đổi ra sao,<br>
            mong rằng tình anh em trong gia đình mình sẽ luôn được gìn giữ và trân trọng.`
        ],

        // Bạn bè - thoải mái, vui vẻ, hiện đại, hài hước
        friends: [
            `Gửi bạn thân yêu,<br><br>
            Năm mới lại đến, mang theo những khởi đầu mới và nhiều hy vọng tốt đẹp.<br>
            Mình chúc bạn một năm thật nhiều sức khỏe, công việc thuận lợi, mọi dự định đều suôn sẻ và đạt được kết quả như mong muốn.<br><br>
            Cảm ơn bạn vì đã luôn đồng hành, chia sẻ và ở bên trong những chặng đường vừa qua.<br>
            Tình bạn của chúng ta là điều rất đáng trân trọng, và mình mong sẽ còn cùng nhau đi thật xa nữa.`,

            `Gửi bạn yêu quý,<br><br>
            Nhân dịp năm mới, mình xin chúc bạn luôn mạnh khỏe, tinh thần tích cực và cuộc sống ngày càng ổn định, đủ đầy.<br>
            Mong rằng những nỗ lực của bạn sẽ được đền đáp xứng đáng, và mỗi ngày trôi qua đều mang lại niềm vui nhỏ bé nhưng ý nghĩa.<br><br>
            Cảm ơn vì bạn luôn là một người bạn chân thành và đáng tin cậy.`,

            `Bạn thân mến,<br><br>
            Năm mới sang trang, mình chúc bạn một năm thật nhiều niềm vui và năng lượng tích cực.<br>
            Công việc thuận buồm xuôi gió, sức khỏe dồi dào và lúc nào cũng giữ được nụ cười tươi tắn như hiện tại.<br><br>
            Mong rằng dù bận rộn đến đâu, chúng ta vẫn luôn giữ được sự gắn bó và thấu hiểu như bây giờ.`,

            `Gửi người bạn đặc biệt,<br><br>
            Nhân dịp năm mới, mình chúc bạn gặp thật nhiều may mắn, thành công và những cơ hội tốt đẹp trong cuộc sống.<br>
            Mong rằng mọi dự định bạn ấp ủ đều dần trở thành hiện thực, và con đường phía trước luôn rộng mở.<br><br>
            Cảm ơn bạn vì đã mang đến nhiều niềm vui và sự tích cực trong cuộc sống của mình.`,

            `Gửi bạn thân,<br><br>
            Năm mới đến, mình chúc bạn một năm bình an, sức khỏe tốt và tinh thần luôn vững vàng.<br>
            Mong rằng cuộc sống sẽ nhẹ nhàng hơn, áp lực ít đi và niềm vui thì nhiều thêm mỗi ngày.<br><br>
            Hy vọng chúng ta vẫn luôn đồng hành, sẻ chia và trân trọng tình bạn quý giá này.`,

            `Gửi người bạn tuyệt vời,<br><br>
            Nhân dịp đầu năm mới, mình chúc bạn một năm sống thật trọn vẹn và ý nghĩa.<br>
            Công việc ổn định, tài chính vững vàng, tinh thần an yên và luôn có những người bạn tốt bên cạnh.<br><br>
            Cảm ơn bạn vì đã luôn lắng nghe, thấu hiểu và ở bên mình trong suốt thời gian qua.`,

            `Bạn thân yêu,<br><br>
            Năm mới là dịp để nhìn lại và hướng về phía trước với nhiều hy vọng hơn.<br>
            Mình chúc bạn luôn giữ được sự chân thành, lạc quan và niềm tin vào những điều tốt đẹp.<br><br>
            Mong rằng tình bạn của chúng ta sẽ luôn được gìn giữ,<br>
            và trở thành một phần ký ức đẹp trong hành trình cuộc sống của cả hai.`,

            `Gửi bạn quý mến,<br><br>
            Nhân dịp năm mới, chúc bạn mọi điều tốt đẹp sẽ đến một cách nhẹ nhàng và bền vững.<br>
            Sức khỏe đủ đầy, công việc hanh thông và cuộc sống luôn có những khoảnh khắc đáng nhớ.<br><br>
            Cảm ơn vì bạn đã là một người bạn tuyệt vời,<br>
            và mong rằng chúng ta sẽ còn đồng hành cùng nhau thật lâu nữa.`
        ],

        // Đồng nghiệp - lịch sự, chuyên nghiệp, tích cực
        colleagues: [
            `Gửi anh/chị/bạn đồng nghiệp thân mến,<br><br>
            Nhân dịp năm mới, xin gửi đến anh/chị/bạn những lời chúc tốt đẹp và chân thành nhất.<br>
            Chúc anh/chị/bạn luôn dồi dào sức khỏe, tinh thần tích cực, công việc thuận lợi và đạt được nhiều kết quả tốt trong năm mới.<br><br>
            Mong rằng năm mới sẽ mang đến nhiều cơ hội phát triển, thành công trong sự nghiệp và hạnh phúc trong cuộc sống gia đình.<br>
            Chúc mừng năm mới!`,

            `Chào anh/chị/bạn đồng nghiệp,<br><br>
            Năm mới đến, xin chúc anh/chị/bạn một năm làm việc hiệu quả, mọi kế hoạch và dự định đều diễn ra suôn sẻ.<br>
            Mong rằng công việc ngày càng ổn định, thu nhập cải thiện và môi trường làm việc luôn tích cực, thoải mái.<br><br>
            Chúc anh/chị/bạn một năm mới an khang, vui vẻ và nhiều động lực để tiếp tục chinh phục những mục tiêu phía trước.`,

            `Gửi đồng nghiệp quý mến,<br><br>
            Nhân dịp đầu xuân năm mới, xin chúc bạn sức khỏe tốt, tinh thần vững vàng và luôn giữ được sự lạc quan trong công việc.<br>
            Mong rằng mọi thử thách đều được giải quyết thuận lợi, các dự án triển khai đúng kế hoạch và đạt kết quả như mong đợi.<br><br>
            Chúc bạn một năm mới làm việc hiệu quả và nhiều niềm vui.`,

            `Kính gửi anh/chị/bạn,<br><br>
            Năm mới là dịp để nhìn lại chặng đường đã qua và hướng đến những mục tiêu mới.<br>
            Xin chúc anh/chị/bạn công việc hanh thông, thu nhập ổn định, từng bước đạt được những mục tiêu đã đề ra.<br><br>
            Rất mong sẽ tiếp tục được đồng hành và hợp tác cùng anh/chị/bạn trong năm mới với nhiều thành công hơn nữa.`,

            `Gửi anh/chị/bạn đồng đội thân thiết,<br><br>
            Nhân dịp năm mới, xin chúc bạn luôn tràn đầy năng lượng, tinh thần sáng tạo và sự kiên định trong công việc.<br>
            Mong rằng những nỗ lực của bạn sẽ được ghi nhận xứng đáng và mang lại nhiều thành quả tích cực trong sự nghiệp.<br><br>
            Chúc bạn một năm mới thành công và nhiều động lực phát triển.`,

            `Kính chúc anh/chị/bạn,<br><br>
            Một năm mới với nhiều dự án thuận lợi, cơ hội phát triển rõ ràng và những bước tiến vững chắc trong công việc.<br>
            Mong rằng năm mới sẽ mang đến sự cân bằng giữa công việc và cuộc sống, để mỗi ngày làm việc đều hiệu quả và ý nghĩa hơn.<br><br>
            Chúc anh/chị/bạn năm mới an khang và thành công.`,

            `Gửi người đồng nghiệp đáng quý,<br><br>
            Nhân dịp năm mới, xin chúc bạn luôn mạnh khỏe, tinh thần tích cực và công việc tiến triển thuận lợi như mong đợi.<br>
            Mong rằng năm mới sẽ mở ra nhiều cơ hội tốt, giúp bạn phát triển bản thân và đạt được những thành tựu đáng tự hào.<br><br>
            Chúc bạn một năm mới bình an, hiệu quả và nhiều niềm vui trong công việc.`
        ],


        // Cô Dì Chú Bác - kính trọng, gần gũi vừa phải
        aunt_uncle: [
            `Kính gửi Cô/Dì/Chú/Bác,<br><br>
            Nhân dịp xuân về năm mới, cháu xin kính chúc Cô/Dì/Chú/Bác luôn dồi dào sức khỏe, tinh thần an vui và cuộc sống bình an.<br>
            Mong rằng năm mới sẽ mang đến nhiều niềm vui, may mắn và hạnh phúc cho Cô/Dì/Chú/Bác cùng gia đình.<br><br>
            Cháu kính chúc Cô/Dì/Chú/Bác một năm mới an khang, vạn sự như ý.`,

            `Kính gửi Cô/Dì/Chú/Bác kính mến,<br><br>
            Năm mới đến, cháu xin gửi lời chúc tốt đẹp và chân thành nhất đến Cô/Dì/Chú/Bác.<br>
            Kính chúc Cô/Dì/Chú/Bác sức khỏe bền lâu, tinh thần thoải mái, gia đình êm ấm và luôn gặp nhiều điều tốt lành trong cuộc sống.<br><br>
            Cháu xin cảm ơn Cô/Dì/Chú/Bác vì luôn dành cho cháu sự quan tâm và yêu thương.`,

            `Thưa Cô/Dì/Chú/Bác,<br><br>
            Nhân dịp đầu xuân năm mới, cháu xin kính chúc Cô/Dì/Chú/Bác phúc lộc đầy nhà, sức khỏe dồi dào và cuộc sống luôn an nhiên, vui vẻ.<br>
            Mong rằng mỗi ngày trôi qua đều là những ngày bình an, ấm áp bên gia đình và con cháu.<br><br>
            Cháu kính chúc Cô/Dì/Chú/Bác một năm mới nhiều niềm vui và hạnh phúc.`,

            `Kính gửi Cô/Dì/Chú/Bác yêu quý,<br><br>
            Năm mới là dịp sum vầy và gửi gắm những lời chúc tốt đẹp.<br>
            Cháu xin kính chúc Cô/Dì/Chú/Bác luôn mạnh khỏe, an khang, gia đình hòa thuận và tràn đầy tiếng cười.<br><br>
            Mong rằng năm mới sẽ mang đến nhiều điều may mắn và bình an cho Cô/Dì/Chú/Bác cùng gia đình.`,

            `Kính thưa Cô/Dì/Chú/Bác,<br><br>
            Nhân dịp năm mới, cháu xin kính chúc Cô/Dì/Chú/Bác thật nhiều sức khỏe, tinh thần vui vẻ và cuộc sống viên mãn.<br>
            Mong rằng Cô/Dì/Chú/Bác luôn an yên, hạnh phúc và mãi là chỗ dựa tinh thần ấm áp cho con cháu trong gia đình.<br><br>
            Cháu kính chúc Cô/Dì/Chú/Bác năm mới bình an và hạnh phúc.`
        ],

        // Người yêu - lãng mạn, ngọt ngào, tình cảm
        lovers: [
            `Gửi người thương yêu,<br><br>
            Một mùa xuân mới lại về, anh/em muốn gửi đến em/anh những lời chúc xuất phát từ tận đáy lòng.<br>
            Chúc em/anh một năm mới thật nhiều sức khỏe, bình an và luôn mỉm cười hạnh phúc.<br><br>
            Cảm ơn em/anh vì đã ở bên anh/em, cùng anh/em đi qua những khoảnh khắc giản dị nhưng đầy yêu thương. Mong rằng năm mới này, chúng ta vẫn sẽ nắm tay nhau thật chặt.`,

            `Em/Anh yêu dấu,<br><br>
            Năm mới đến, anh/em không mong gì hơn ngoài việc được tiếp tục đồng hành cùng em/anh trên chặng đường phía trước.<br>
            Chúc em/anh luôn an yên trong tâm hồn, vững vàng trong cuộc sống và luôn cảm nhận được tình yêu chân thành từ anh/em.<br><br>
            Mong rằng mỗi ngày của năm mới đều có chúng ta bên nhau.`,

            `Người anh/em thương nhất,<br><br>
            Nhân dịp đầu năm, anh/em xin chúc em/anh thật nhiều niềm vui, sức khỏe dồi dào và mọi điều tốt đẹp sẽ nhẹ nhàng tìm đến.<br>
            Cảm ơn em/anh vì đã bước vào cuộc đời anh/em và khiến những ngày bình thường trở nên ý nghĩa hơn.<br><br>
            Anh/em mong rằng tình yêu của chúng ta sẽ ngày càng bền chặt theo thời gian.`,

            `Gửi người đồng hành của anh/em,<br><br>
            Năm mới là dịp để nhìn lại và trân trọng những điều quý giá đang có.<br>
            Với anh/em, điều quý giá nhất chính là em/anh – người luôn lắng nghe, thấu hiểu và yêu thương anh/em bằng tất cả sự chân thành.<br><br>
            Chúc em/anh một năm mới an yên, và mong rằng chúng ta sẽ tiếp tục cùng nhau xây dựng thật nhiều kỷ niệm đẹp.`,

            `Em/Anh thân yêu,<br><br>
            Trong khoảnh khắc giao mùa này, anh/em chỉ muốn nói rằng: có em/anh bên cạnh là điều may mắn lớn nhất trong cuộc đời anh/em.<br>
            Chúc em/anh năm mới nhiều sức khỏe, nhiều niềm vui và luôn cảm nhận được sự ấm áp khi có anh/em ở bên.<br><br>
            Mong rằng chúng ta sẽ luôn chọn nhau, hôm nay và cả những ngày sau.`,

            `Người quan trọng nhất của anh/em,<br><br>
            Năm mới đến, anh/em không cầu mong điều gì quá lớn lao, chỉ mong em/anh luôn bình an và hạnh phúc.<br>
            Dù cuộc sống có đổi thay thế nào, anh/em hy vọng chúng ta vẫn sẽ cùng nhau đi tiếp bằng sự yêu thương và thấu hiểu.<br><br>
            Cảm ơn em/anh vì đã là một phần không thể thiếu trong cuộc đời anh/em.`,

            `Gửi người anh/em yêu thương,<br><br>
            Xuân mới mang theo hy vọng và những khởi đầu tốt đẹp.<br>
            Anh/em mong rằng năm mới này sẽ là một năm đầy ắp tiếng cười, sự sẻ chia và những khoảnh khắc bình yên của riêng chúng ta.<br><br>
            Chúc em/anh luôn mạnh mẽ, dịu dàng và mãi ở đây cùng anh/em.`,

            `Em/Anh yêu quý,<br><br>
            Một năm mới lại bắt đầu, và anh/em thật hạnh phúc khi vẫn có em/anh ở bên cạnh.<br>
            Chúc cho tình yêu của chúng ta luôn được nuôi dưỡng bằng sự chân thành, kiên nhẫn và bao dung.<br><br>
            Anh/em tin rằng, chỉ cần có nhau, mọi năm mới đều trở nên ý nghĩa hơn rất nhiều.`
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
            const minInput = document.getElementById(`min-${group}`);
            const maxInput = document.getElementById(`max-${group}`);
            const minDisplay = document.getElementById(`display-min-${group}`);
            const maxDisplay = document.getElementById(`display-${group}`);

            minInput.value = amountRanges[group].min;
            maxInput.value = amountRanges[group].max;
            minDisplay.textContent = formatCurrency(amountRanges[group].min);
            maxDisplay.textContent = formatCurrency(amountRanges[group].max);
        });
    }

    function syncMinMax(group, changedType) {
        const minInput = document.getElementById(`min-${group}`);
        const maxInput = document.getElementById(`max-${group}`);
        const minDisplay = document.getElementById(`display-min-${group}`);
        const maxDisplay = document.getElementById(`display-${group}`);

        let minVal = Number(minInput.value);
        let maxVal = Number(maxInput.value);

        if (minVal > maxVal) {
            if (changedType === 'min') {
                maxInput.value = minVal;
                maxDisplay.textContent = formatCurrency(minVal);
            } else if (changedType === 'max') {
                minInput.value = maxVal;
                minDisplay.textContent = formatCurrency(maxVal);
            }
        } else {
            minDisplay.textContent = formatCurrency(minVal);
            maxDisplay.textContent = formatCurrency(maxVal);
        }
    }

    document.querySelectorAll('#settings-modal input[type="range"]').forEach(slider => {
        slider.addEventListener('input', () => {
            const [type, group] = slider.id.split('-');

            syncMinMax(group, type);
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
            const minInput = document.getElementById(`min-${group}`);
            const maxInput = document.getElementById(`max-${group}`);

            let minVal = Number(minInput.value);
            let maxVal = Number(maxInput.value);

            if (minVal > maxVal) {
                maxVal = minVal;
                maxInput.value = maxVal;
            }

            amountRanges[group] = {
                min: minVal,
                max: maxVal
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

        const popularAmounts = [10000, 20000, 50000, 100000, 200000, 500000];
        const possibleAmounts = popularAmounts.filter(amount => amount >= min && amount <= max);
        if (possibleAmounts.length === 0) {
            return popularAmounts.reduce((prev, curr) =>
                Math.abs(curr - min) < Math.abs(prev - min) ? curr : prev
            );
        }
        const randomIndex = Math.floor(Math.random() * possibleAmounts.length);
        return possibleAmounts[randomIndex];
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
            "from-amber-700 to-red-900", "from-red-600 to-amber-800", "from-amber-800 to-red-600",
            "from-red-600 to-red-800", "from-red-700 to-red-900", "from-amber-600 to-amber-800",
            "from-red-800 to-red-950", "from-amber-700 to-amber-900", "from-red-900 to-amber-900",
            "from-amber-800 to-red-900", "from-red-700 to-amber-800", "from-amber-900 to-red-800",
            "from-red-800 to-amber-700", "from-amber-800 to-red-950", "from-red-950 to-amber-800",
            "from-amber-900 to-red-700", "from-red-900 to-amber-950", "from-red-600 to-amber-700",
            "from-amber-700 to-red-800", "from-red-800 to-amber-800", "from-amber-800 to-red-700",
            "from-red-700 to-amber-900", "from-amber-900 to-red-600", "from-red-900 to-amber-700",
            "from-amber-700 to-red-900", "from-red-600 to-amber-800", "from-amber-800 to-red-600"
        ];

        for (let i = 1; i <= 40; i++) {
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
        const randomContent = templates[Math.floor(Math.random() * templates.length)];

        return {
            date: `Ngày ${dateStr}`,
            greeting: `${relationship.formal},`,
            content: randomContent,
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