document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const relationshipSelection = document.getElementById("relationship-selection");
    const relationshipGrid = relationshipSelection ? relationshipSelection.querySelector(".grid") : null;
    const specificSelection = document.getElementById("specific-selection");
    const specificGrid = specificSelection ? specificSelection.querySelector(".grid") : null;
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
    const letterRecipient = document.getElementById("letter-recipient");
    const letterDate = document.getElementById("letter-date");
    const letterGreeting = document.getElementById("letter-greeting");
    const letterContent = document.getElementById("letter-content");
    const letterClosing = document.getElementById("letter-closing");
    let scratchCanvas = null;
    const moneyAmount = document.getElementById("money-amount");
    const closeModalBtn = document.getElementById("close-modal");
    const step1Dot = document.getElementById("step1-dot");
    const step2Dot = document.getElementById("step2-dot");
    const step3Dot = document.getElementById("step3-dot");
    const step4Dot = document.getElementById("step4-dot");
    const scrollToSpecific = document.getElementById("scroll-to-specific");
    const scrollToAge = document.getElementById("scroll-to-age");
    const scrollToHongbao = document.getElementById("scroll-to-hongbao");

    // Variables
    let selectedRelationship = null;
    let selectedSpecific = null;
    let selectedAge = null;
    let selectedHongbao = null;
    let isRolling = false;
    let isScratching = false;
    let ctx = null;
    let currentAmount = 0;
    let selectedRelationshipId = "";
    let selectedSpecificId = "";
    let selectedAgeId = "";
    let scratchPoints = [];

    // Relationships (8 options)
    const relationships = [
        { id: "grandparents", name: "Ông Bà", icon: "fa-solid fa-person-cane" },
        { id: "parents", name: "Bố Mẹ", icon: "fa-solid fa-house-user" },
        { id: "children", name: "Con Cái", icon: "fa-solid fa-children" },
        { id: "siblings", name: "Anh Chị Em", icon: "fa-solid fa-people-group" },
        { id: "aunt_uncle", name: "Cô Dì Chú Bác", icon: "fa-solid fa-people-roof" },
        { id: "friends", name: "Bạn Bè", icon: "fa-solid fa-user-group" },
        { id: "colleagues", name: "Đồng Nghiệp", icon: "fa-solid fa-handshake" },
        { id: "lovers", name: "Người Yêu", icon: "fa-solid fa-heart-circle-plus" }
    ];

    // Specific options for each relationship
    const specificOptions = {
        grandparents: [
            { id: "ong", name: "Ông", icon: "fa-solid fa-male" },
            { id: "ba", name: "Bà", icon: "fa-solid fa-female" },
            { id: "ong-ba", name: "Ông Bà", icon: "fa-solid fa-people-arrows" }
        ],
        parents: [
            { id: "bo", name: "Bố", icon: "fa-solid fa-male" },
            { id: "me", name: "Mẹ", icon: "fa-solid fa-female" },
            { id: "bo-me", name: "Bố Mẹ", icon: "fa-solid fa-people-arrows" }
        ],
        children: [
            { id: "con-trai", name: "Con Trai", icon: "fa-solid fa-child" },
            { id: "con-gai", name: "Con Gái", icon: "fa-solid fa-child-dress" },
            { id: "cac-con", name: "Các Con", icon: "fa-solid fa-children" }
        ],
        siblings: [
            { id: "anh", name: "Anh", icon: "fa-solid fa-male" },
            { id: "chi", name: "Chị", icon: "fa-solid fa-female" },
            { id: "em-trai", name: "Em Trai", icon: "fa-solid fa-male" },
            { id: "em-gai", name: "Em Gái", icon: "fa-solid fa-female" }
        ],
        aunt_uncle: [
            { id: "co", name: "Cô", icon: "fa-solid fa-female" },
            { id: "di", name: "Dì", icon: "fa-solid fa-female" },
            { id: "chu", name: "Chú", icon: "fa-solid fa-male" },
            { id: "bac", name: "Bác", icon: "fa-solid fa-male" }
        ],
        friends: [
            { id: "ban-nam", name: "Bạn Nam", icon: "fa-solid fa-male" },
            { id: "ban-nu", name: "Bạn Nữ", icon: "fa-solid fa-female" },
            { id: "ban-be", name: "Bạn Bè", icon: "fa-solid fa-user-group" }
        ],
        colleagues: [
            { id: "dong-nghiep-nam", name: "Đồng Nghiệp Nam", icon: "fa-solid fa-male" },
            { id: "dong-nghiep-nu", name: "Đồng Nghiệp Nữ", icon: "fa-solid fa-female" },
            { id: "dong-nghiep", name: "Đồng Nghiệp", icon: "fa-solid fa-handshake" }
        ],
        lovers: [
            { id: "ban-trai", name: "Bạn Trai", icon: "fa-solid fa-male" },
            { id: "ban-gai", name: "Bạn Gái", icon: "fa-solid fa-female" },
            { id: "vo-chong", name: "Vợ/Chồng", icon: "fa-solid fa-ring" }
        ]
    };

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

    // Letter Templates - IMPROVED CONTENT
    const letterTemplates = {
        ong: {
            greeting: "Kính gửi Ông,",
            recipient: "Gửi Ông",
            content: [
                `Xuân về hoa nở khắp nơi, cháu xin kính gửi đến Ông lời chúc sức khỏe, sống lâu trăm tuổi. Tuổi già của Ông là phúc lành của cả gia đình.<br><br>Mong Ông luôn minh mẫn, vui vẻ bên con cháu. Những lời dạy bảo của Ông là kim chỉ nam cho cuộc đời cháu. Năm mới này, cháu chúc Ông luôn an khang thịnh vượng.`,
                `Thưa Ông,<br><br>Tết đến xuân về, cháu xin kính chúc Ông phúc thọ miên trường. Tuổi cao của Ông là niềm tự hào và điểm tựa vững chắc của gia đình.<br><br>Cháu luôn ghi nhớ những lời dạy quý báu của Ông. Chúc Ông năm mới vạn sự như ý, tràn đầy niềm vui bên con cháu.`
            ],
            closing: "Kính chúc Ông"
        },
        ba: {
            greeting: "Kính gửi Bà,",
            recipient: "Gửi Bà",
            content: [
                `Xuân sang mang theo vạn điều tốt lành, cháu xin gửi đến Bà lời chúc sức khỏe, tuổi thọ như đá Sơn Tinh. Bà là ánh sáng ấm áp của gia đình.<br><br>Những bữa cơm Bà nấu, những lời ru ngọt ngào vẫn mãi trong lòng cháu. Chúc Bà năm mới luôn vui vẻ, an khang, sum vầy bên con cháu.`,
                `Kính thưa Bà,<br><br>Tết đến xuân về, cháu xin chúc Bà sức khỏe dồi dào, phúc lộc viên mãn. Tình thương của Bà như mặt trời sưởi ấm tim cháu.<br><br>Cháu mong Bà luôn bình an, mạnh khỏe để chứng kiến con cháu lớn khôn. Năm mới vạn sự như ý!`
            ],
            closing: "Kính chúc Bà"
        },
        "ong-ba": {
            greeting: "Kính gửi Ông Bà,",
            recipient: "Gửi Ông Bà",
            content: [
                `Xuân về mang theo niềm vui mới, cháu xin kính chúc Ông Bà sức khỏe, sống lâu trăm tuổi, phúc như Đông Hải. Ông Bà là trụ cột, là bóng mát che chở cho cả gia đình.<br><br>Những lời dạy của Ông Bà là hành trang quý giá nhất cho cuộc đời cháu. Mong Ông Bà luôn vui vẻ, an lạc, được quây quần bên con cháu.`,
                `Thưa Ông Bà,<br><br>Tết đến xuân về, cháu xin kính chúc Ông Bà vạn sự như ý, tuổi thọ miên trường. Sự bình an của Ông Bà chính là hạnh phúc lớn nhất của gia đình.<br><br>Cháu biết ơn Ông Bà đã dạy dỗ, nuôi nấng. Chúc Ông Bà năm mới nhiều sức khỏe, sum vầy cùng con cháu!`
            ],
            closing: "Kính chúc Ông Bà"
        },
        bo: {
            greeting: "Kính gửi Bố,",
            recipient: "Gửi Bố",
            content: [
                `Gửi Bố yêu quý,<br><br>Xuân về đầy ắp hy vọng, con xin chúc Bố sức khỏe, công việc thuận lợi, thành công rực rỡ. Bố là điểm tựa vững chắc, là người hùng trong lòng con.<br><br>Con biết Bố đã vất vả nuôi con khôn lớn. Mỗi giọt mồ hôi của Bố là tình yêu thương vô bờ bến. Năm mới này, con hứa sẽ cố gắng hơn nữa để Bố tự hào.`,
                `Thưa Bố,<br><br>Tết đến xuân về, con xin chúc Bố năm mới an khang, phát tài phát lộc. Bố là tấm gương sáng cho con noi theo.<br><br>Con trân trọng từng lời dạy của Bố. Chúc Bố luôn mạnh khỏe, hạnh phúc bên gia đình!`
            ],
            closing: "Kính chúc Bố"
        },
        me: {
            greeting: "Kính gửi Mẹ,",
            recipient: "Gửi Mẹ",
            content: [
                `Gửi Mẹ yêu thương,<br><br>Xuân sang muôn hoa khoe sắc, con xin chúc Mẹ luôn xinh đẹp, tràn đầy sức khỏe và niềm vui. Tình yêu của Mẹ như ánh nắng sưởi ấm trái tim con.<br><br>Những bàn tay Mẹ đã chăm sóc con từng ngày từng giờ. Con biết ơn Mẹ vô cùng. Năm mới này, con chúc Mẹ luôn hạnh phúc, thanh xuân mãi không phai.`,
                `Kính thưa Mẹ,<br><br>Tết đến xuân về, con xin chúc Mẹ sức khỏe dồi dào, vạn sự như ý. Mẹ là người con yêu thương nhất trên đời.<br><br>Những bữa cơm Mẹ nấu, những đêm Mẹ thức chăm con ốm... tất cả đều là tình yêu vô bờ. Chúc Mẹ năm mới tràn ngập niềm vui!`
            ],
            closing: "Kính chúc Mẹ"
        },
        "bo-me": {
            greeting: "Kính gửi Bố Mẹ,",
            recipient: "Gửi Bố Mẹ",
            content: [
                `Gửi Bố Mẹ yêu quý,<br><br>Xuân về với muôn vàn niềm vui, con xin chúc Bố Mẹ sức khỏe, hạnh phúc, gia đình luôn ấm no. Bố Mẹ là tất cả của con, là mái nhà bình yên nhất.<br><br>Con biết Bố Mẹ đã hi sinh rất nhiều để nuôi con khôn lớn. Tình thương của Bố Mẹ là món quà vô giá. Năm mới, con chúc Bố Mẹ luôn khỏe mạnh, sum vầy hạnh phúc.`,
                `Kính thưa Bố Mẹ,<br><br>Tết đến xuân về, con xin gửi đến Bố Mẹ lời chúc tốt đẹp nhất. Chúc Bố Mẹ năm mới an khang thịnh vượng, phát tài phát lộc.<br><br>Con sẽ cố gắng học tập, làm việc thật tốt để đền đáp công ơn sinh thành của Bố Mẹ. Chúc gia đình luôn hạnh phúc!`
            ],
            closing: "Kính chúc Bố Mẹ"
        },
        "con-trai": {
            greeting: "Gửi con trai yêu quý,",
            recipient: "Gửi con trai",
            content: [
                `Con trai của Bố/Mẹ,<br><br>Xuân về đầy ắp niềm vui, Bố/Mẹ chúc con khỏe mạnh, học hành giỏi giang, trở thành người con ngoan, người em tốt. Con là niềm tự hào của gia đình.<br><br>Mong con luôn giữ được bản lĩnh, sống thật tốt. Năm mới này, Bố/Mẹ chúc con thành công, hạnh phúc, gặp nhiều may mắn.`,
                `Gửi con yêu,<br><br>Tết đến rồi! Bố/Mẹ chúc con năm mới tràn đầy niềm vui, sức khỏe, học tập tiến bộ. Con là niềm hy vọng, là tương lai của gia đình.<br><br>Hãy luôn giữ cho mình tinh thần lạc quan, trái tim nhân hậu. Bố/Mẹ tin con sẽ làm được những điều tuyệt vời!`
            ],
            closing: "Yêu con"
        },
        "con-gai": {
            greeting: "Gửi con gái yêu quý,",
            recipient: "Gửi con gái",
            content: [
                `Con gái của Bố/Mẹ,<br><br>Xuân sang hoa nở rực rỡ, Bố/Mẹ chúc con luôn xinh đẹp, tươi tắn như hoa. Con là công chúa nhỏ của gia đình, là niềm vui mỗi ngày của Bố/Mẹ.<br><br>Mong con luôn vui vẻ, tự tin, và thành công trong mọi việc. Năm mới này, chúc con gặp nhiều điều tốt lành, luôn được yêu thương.`,
                `Gửi công chúa nhỏ,<br><br>Tết đến xuân về, Bố/Mẹ chúc con năm mới an khang, học hành tấn tới, ngày càng khôn lớn. Con là ánh sáng trong cuộc đời Bố/Mẹ.<br><br>Hãy luôn giữ cho mình nụ cười tươi, trái tim ấm áp. Bố/Mẹ yêu con vô cùng!`
            ],
            closing: "Yêu con"
        },
        "cac-con": {
            greeting: "Gửi các con yêu quý,",
            recipient: "Gửi các con",
            content: [
                `Gửi những đứa con ngoan,<br><br>Xuân về với muôn màu sắc tươi vui, Bố/Mẹ chúc các con luôn khỏe mạnh, vui vẻ, học hành chăm ngoan. Các con là niềm tự hào và hạnh phúc lớn nhất của Bố/Mẹ.<br><br>Mong các con luôn yêu thương, giúp đỡ lẫn nhau. Năm mới này, chúc cả nhà luôn sum vầy, ấm áp, tràn đầy tiếng cười.`,
                `Gửi các con yêu,<br><br>Tết đến rồi! Bố/Mẹ chúc các con năm mới an khang, thành công rực rỡ. Mỗi đứa con đều là món quà quý giá của cuộc đời Bố/Mẹ.<br><br>Hãy luôn giữ cho mình tinh thần lạc quan, trái tim nhân ái. Gia đình luôn là nơi bình yên nhất!`
            ],
            closing: "Thương yêu các con"
        },
        anh: {
            greeting: "Gửi anh,",
            recipient: "Gửi anh",
            content: [
                `Gửi anh trai thân yêu,<br><br>Xuân về tươi đẹp, em xin chúc anh sức khỏe, công việc thuận lợi, thành công vượt bậc. Anh là người anh tốt mà em luôn tự hào.<br><br>Những kỷ niệm tuổi thơ bên anh là kho báu của em. Chúc anh năm mới gặp nhiều may mắn, gia đình luôn hạnh phúc.`,
                `Gửi anh,<br><br>Tết đến xuân về, em chúc anh vạn sự như ý, phát tài phát lộc. Anh luôn là tấm gương để em noi theo.<br><br>Mong anh luôn khỏe mạnh, vui vẻ. Chúc anh năm mới nhiều niềm vui!`
            ],
            closing: "Thân mến"
        },
        chi: {
            greeting: "Gửi chị,",
            recipient: "Gửi chị",
            content: [
                `Gửi chị gái yêu quý,<br><br>Xuân sang muôn hoa khoe sắc, em xin chúc chị luôn xinh đẹp, tràn đầy sức khỏe và niềm vui. Chị là người chị tuyệt vời mà em luôn yêu mến.<br><br>Cảm ơn chị đã luôn quan tâm, chăm sóc em. Chúc chị năm mới thật nhiều hạnh phúc, thành công rực rỡ.`,
                `Gửi chị,<br><br>Tết đến rồi! Em chúc chị năm mới an khang, vạn sự như ý. Chị luôn là người em tin tưởng nhất.<br><br>Mong chị luôn vui vẻ, gặp nhiều điều tốt lành. Yêu chị nhiều!`
            ],
            closing: "Thân mến"
        },
        "em-trai": {
            greeting: "Gửi em trai,",
            recipient: "Gửi em trai",
            content: [
                `Gửi em trai thân yêu,<br><br>Xuân về đầy ắp niềm vui, anh/chị chúc em khỏe mạnh, học hành giỏi giang, trở thành người em ngoan. Em là niềm vui của gia đình.<br><br>Hãy luôn cố gắng, giữ vững tinh thần lạc quan. Năm mới này, chúc em thành công, gặp nhiều may mắn.`,
                `Gửi em,<br><br>Tết đến xuân về, anh/chị chúc em năm mới vạn sự như ý, học tập tiến bộ. Em là người em tuyệt vời!<br><br>Mong em luôn vui vẻ, tự tin. Anh/chị luôn ở bên em!`
            ],
            closing: "Thương em"
        },
        "em-gai": {
            greeting: "Gửi em gái,",
            recipient: "Gửi em gái",
            content: [
                `Gửi em gái yêu quý,<br><br>Xuân sang hoa nở rực rỡ, anh/chị chúc em luôn xinh đẹp, tươi tắn như hoa. Em là công chúa nhỏ của gia đình.<br><br>Hãy luôn giữ cho mình nụ cười tươi, trái tim ấm áp. Năm mới này, chúc em thật nhiều niềm vui và thành công.`,
                `Gửi em yêu,<br><br>Tết đến rồi! Anh/chị chúc em năm mới an khang, học hành tiến bộ. Em là niềm tự hào của anh/chị.<br><br>Mong em luôn vui vẻ, gặp nhiều điều tốt lành. Yêu em nhiều lắm!`
            ],
            closing: "Thương em"
        },
        co: {
            greeting: "Kính gửi Cô,",
            recipient: "Gửi Cô",
            content: [
                `Kính thưa Cô,<br><br>Xuân về tươi đẹp, cháu xin chúc Cô sức khỏe, gia đình hạnh phúc, công việc thuận lợi. Tình cảm của Cô dành cho cháu thật ấm áp.<br><br>Cháu luôn biết ơn sự quan tâm của Cô. Chúc Cô năm mới gặp nhiều may mắn, vạn sự như ý.`,
                `Gửi Cô,<br><br>Tết đến xuân về, cháu chúc Cô năm mới an khang, xinh đẹp, tràn đầy niềm vui. Cô là người cháu luôn kính trọng.<br><br>Mong Cô luôn khỏe mạnh, hạnh phúc bên gia đình!`
            ],
            closing: "Kính chúc Cô"
        },
        di: {
            greeting: "Kính gửi Dì,",
            recipient: "Gửi Dì",
            content: [
                `Kính thưa Dì,<br><br>Xuân sang muôn hoa khoe sắc, cháu xin chúc Dì luôn xinh đẹp, sức khỏe, gia đình hạnh phúc. Dì luôn là người thân yêu của cháu.<br><br>Cảm ơn Dì đã luôn quan tâm, chăm sóc cháu. Chúc Dì năm mới nhiều niềm vui, thành công rực rỡ.`,
                `Gửi Dì,<br><br>Tết đến rồi! Cháu chúc Dì năm mới vạn sự như ý, phát tài phát lộc. Dì là người cháu luôn yêu mến.<br><br>Mong Dì luôn vui vẻ, gặp nhiều điều tốt lành!`
            ],
            closing: "Kính chúc Dì"
        },
        chu: {
            greeting: "Kính gửi Chú,",
            recipient: "Gửi Chú",
            content: [
                `Kính thưa Chú,<br><br>Xuân về đầy ắp hy vọng, cháu xin chúc Chú sức khỏe, công việc thăng tiến, gia đình hạnh phúc. Chú là người cháu luôn kính trọng.<br><br>Cháu biết ơn những lời dạy bảo của Chú. Chúc Chú năm mới gặp nhiều may mắn, phát tài phát lộc.`,
                `Gửi Chú,<br><br>Tết đến xuân về, cháu chúc Chú năm mới vạn sự như ý, thành công rực rỡ. Chú luôn là tấm gương cho cháu noi theo.<br><br>Mong Chú luôn khỏe mạnh, vui vẻ bên gia đình!`
            ],
            closing: "Kính chúc Chú"
        },
        bac: {
            greeting: "Kính gửi Bác,",
            recipient: "Gửi Bác",
            content: [
                `Kính thưa Bác,<br><br>Xuân sang tươi đẹp, cháu xin chúc Bác sức khỏe dồi dào, gia đình hạnh phúc, công việc thuận buồm xuôi gió. Bác là người cháu luôn kính mến.<br><br>Cảm ơn Bác đã luôn quan tâm đến cháu. Chúc Bác năm mới nhiều niềm vui, vạn sự như ý.`,
                `Gửi Bác,<br><br>Tết đến rồi! Cháu chúc Bác năm mới an khang thịnh vượng, phát tài phát lộc. Bác luôn là người cháu tôn trọng.<br><br>Mong Bác luôn vui vẻ, khỏe mạnh!`
            ],
            closing: "Kính chúc Bác"
        },
        "ban-nam": {
            greeting: "Gửi bạn,",
            recipient: "Gửi bạn",
            content: [
                `Gửi bạn thân,<br><br>Xuân về rồi! Mình chúc bạn năm mới sức khỏe, thành công trong công việc, gặp nhiều may mắn. Tình bạn của chúng mình là món quà quý giá.<br><br>Cảm ơn bạn đã luôn bên cạnh, chia sẻ mọi lúc. Chúc bạn năm mới thật nhiều niềm vui, hạnh phúc.`,
                `Gửi bạn,<br><br>Tết đến xuân về, mình chúc bạn vạn sự như ý, công danh thăng tiến. Bạn là người bạn tốt nhất của mình.<br><br>Mong chúng mình luôn là bạn tốt, cùng nhau vượt qua mọi thử thách!`
            ],
            closing: "Thân mến"
        },
        "ban-nu": {
            greeting: "Gửi bạn,",
            recipient: "Gửi bạn",
            content: [
                `Gửi bạn thân yêu,<br><br>Xuân sang hoa nở khắp nơi, mình chúc bạn luôn xinh đẹp, tràn đầy niềm vui và may mắn. Bạn là người bạn tuyệt vời nhất.<br><br>Cảm ơn bạn đã luôn lắng nghe, chia sẻ. Chúc bạn năm mới thật nhiều hạnh phúc, thành công rực rỡ.`,
                `Gửi bạn yêu,<br><br>Tết đến rồi! Mình chúc bạn năm mới an khang, vạn sự như ý. Tình bạn của chúng mình là điều quý giá nhất.<br><br>Mong bạn luôn vui vẻ, gặp nhiều điều tốt lành!`
            ],
            closing: "Thân mến"
        },
        "ban-be": {
            greeting: "Gửi các bạn,",
            recipient: "Gửi các bạn",
            content: [
                `Gửi hội bạn thân,<br><br>Xuân về đầy ắp niềm vui, mình chúc tất cả năm mới sức khỏe, thành công, gặp nhiều may mắn. Những kỷ niệm bên nhau là kho báu của chúng mình.<br><br>Cảm ơn các bạn đã luôn ở bên, chia sẻ mọi lúc. Chúc chúng mình luôn là bạn tốt, cùng nhau vượt qua mọi thử thách.`,
                `Gửi các bạn,<br><br>Tết đến xuân về, mình chúc tất cả vạn sự như ý, hạnh phúc viên mãn. Tình bạn của chúng mình là điều quý giá.<br><br>Mong chúng mình luôn vui vẻ, cùng nhau tạo thêm nhiều kỷ niệm đẹp!`
            ],
            closing: "Thân mến"
        },
        "dong-nghiep-nam": {
            greeting: "Gửi đồng nghiệp,",
            recipient: "Gửi đồng nghiệp",
            content: [
                `Gửi đồng nghiệp thân mến,<br><br>Xuân về với muôn vàn niềm vui, tôi xin chúc anh/bạn sức khỏe, công việc thăng tiến, gặp nhiều thành công. Được làm việc cùng là niềm vui lớn.<br><br>Mong năm mới chúng ta sẽ tiếp tục hợp tác tốt đẹp, cùng nhau đạt được nhiều mục tiêu. Chúc anh/bạn gia đình hạnh phúc, phát tài phát lộc.`,
                `Gửi đồng nghiệp,<br><br>Tết đến xuân về, tôi chúc anh/bạn năm mới vạn sự như ý, sự nghiệp thăng hoa. Anh/bạn là đồng nghiệp tuyệt vời.<br><br>Chúc team luôn đoàn kết, thành công!`
            ],
            closing: "Trân trọng"
        },
        "dong-nghiep-nu": {
            greeting: "Gửi đồng nghiệp,",
            recipient: "Gửi đồng nghiệp",
            content: [
                `Gửi đồng nghiệp thân mến,<br><br>Xuân sang hoa nở khắp nơi, tôi xin chúc chị/bạn luôn xinh đẹp, sức khỏe, công việc thuận lợi. Được làm việc cùng là niềm vui.<br><br>Mong năm mới chúng ta sẽ tiếp tục hợp tác hiệu quả, cùng nhau đạt được nhiều thành công. Chúc chị/bạn gia đình hạnh phúc, vạn sự như ý.`,
                `Gửi đồng nghiệp,<br><br>Tết đến rồi! Tôi chúc chị/bạn năm mới an khang, sự nghiệp thăng hoa. Chị/bạn là người đồng nghiệp tuyệt vời.<br><br>Chúc team luôn thành công!`
            ],
            closing: "Trân trọng"
        },
        "dong-nghiep": {
            greeting: "Gửi đồng nghiệp,",
            recipient: "Gửi đồng nghiệp",
            content: [
                `Gửi đồng nghiệp thân mến,<br><br>Xuân về tươi đẹp, tôi xin chúc tất cả sức khỏe dồi dào, công việc thuận lợi, gia đình hạnh phúc. Được làm việc cùng nhau là niềm vui lớn.<br><br>Mong năm mới chúng ta sẽ tiếp tục đoàn kết, hợp tác hiệu quả, cùng nhau đạt được nhiều thành tựu. Chúc team luôn thành công, phát triển.`,
                `Gửi các đồng nghiệp,<br><br>Tết đến xuân về, tôi chúc mọi người năm mới vạn sự như ý, thăng tiến trong sự nghiệp. Chúng ta là một team tuyệt vời.<br><br>Chúc tất cả luôn vui vẻ, thành công!`
            ],
            closing: "Trân trọng"
        },
        "ban-trai": {
            greeting: "Gửi anh yêu,",
            recipient: "Gửi anh yêu",
            content: [
                `Gửi người yêu dấu,<br><br>Xuân về với muôn vàn niềm vui, em xin chúc anh sức khỏe, công việc thành công, luôn tràn đầy năng lượng. Anh là ánh sáng trong cuộc đời em.<br><br>Cảm ơn anh đã luôn bên cạnh, yêu thương em. Năm mới này, em chúc chúng ta sẽ có thêm nhiều kỷ niệm đẹp, cùng nhau vượt qua mọi thử thách. Em yêu anh rất nhiều.`,
                `Gửi anh,<br><br>Tết đến rồi! Em chúc anh năm mới an khang, vạn sự như ý. Anh là tất cả của em.<br><br>Mong chúng ta luôn bên nhau, yêu thương mãi mãi. Em yêu anh!`
            ],
            closing: "Yêu anh"
        },
        "ban-gai": {
            greeting: "Gửi em yêu,",
            recipient: "Gửi em yêu",
            content: [
                `Gửi người yêu dấu,<br><br>Xuân sang hoa nở rực rỡ, anh xin chúc em luôn xinh đẹp, tươi tắn, tràn đầy niềm vui. Em là ánh sáng trong cuộc đời anh.<br><br>Cảm ơn em đã luôn ở bên, yêu thương anh. Năm mới này, anh chúc chúng ta sẽ có thêm nhiều kỷ niệm ngọt ngào, cùng nhau vượt qua mọi khó khăn. Anh yêu em rất nhiều.`,
                `Gửi em,<br><br>Tết đến xuân về, anh chúc em năm mới an khang, xinh đẹp. Em là tất cả của anh.<br><br>Mong chúng ta luôn bên nhau, hạnh phúc mãi mãi. Anh yêu em!`
            ],
            closing: "Yêu em"
        },
        "vo-chong": {
            greeting: "Gửi vợ/chồng yêu,",
            recipient: "Gửi vợ/chồng yêu",
            content: [
                `Gửi người bạn đời thân yêu,<br><br>Xuân về với muôn vàn niềm vui, anh/em xin chúc em/anh sức khỏe, hạnh phúc, gia đình luôn ấm no. Em/anh là tất cả của anh/em, là nửa còn lại của cuộc đời.<br><br>Cảm ơn em/anh đã luôn ở bên, cùng anh/em vượt qua mọi thăng trầm. Năm mới này, chúc chúng ta luôn yêu thương, gia đình sum vầy, hạnh phúc.`,
                `Gửi người yêu thương nhất,<br><br>Tết đến rồi! Anh/em chúc em/anh năm mới vạn sự như ý, gia đình luôn hạnh phúc. Em/anh là món quà quý giá nhất.<br><br>Mong chúng ta luôn bên nhau, yêu thương mãi mãi!`
            ],
            closing: "Yêu em/anh"
        }
    };

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
      `;

            card.addEventListener("click", function () {
                if (selectedRelationship === this) return;

                document.querySelectorAll("#relationship-selection .selection-card").forEach((c) => {
                    c.classList.remove("selected");
                });

                selectedRelationship = this;
                selectedRelationshipId = relationship.id;
                this.classList.add("selected");

                updateStepIndicator(2);
                if (scrollToSpecific) scrollToSpecific.classList.remove("hidden");

                setTimeout(() => {
                    initSpecificSelection();
                    if (specificSelection) specificSelection.classList.remove("hidden");
                    if (specificSelection) specificSelection.scrollIntoView({ behavior: "smooth", block: "start" });

                    setTimeout(() => {
                        if (scrollToSpecific) scrollToSpecific.classList.add("hidden");
                    }, 1000);
                }, 300);
            });

            relationshipGrid.appendChild(card);
        });

        updateStepIndicator(1);
    }

    // Initialize Specific Selection
    function initSpecificSelection() {
        if (!specificGrid) return;
        specificGrid.innerHTML = "";

        const options = specificOptions[selectedRelationshipId] || [];

        options.forEach((option) => {
            const card = document.createElement("div");
            card.className = "selection-card rounded-xl p-4 text-center cursor-pointer h-full";
            card.dataset.specific = option.id;

            card.innerHTML = `
        <div class="text-3xl text-amber-300 mb-3">
          <i class="${option.icon}"></i>
        </div>
        <div class="text-lg font-bold text-white mb-1">${option.name}</div>
      `;

            card.addEventListener("click", function () {
                if (selectedSpecific === this) return;

                document.querySelectorAll("#specific-selection .selection-card").forEach((c) => {
                    c.classList.remove("selected");
                });

                selectedSpecific = this;
                selectedSpecificId = option.id;
                this.classList.add("selected");

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
            });

            specificGrid.appendChild(card);
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

        const template = letterTemplates[selectedSpecificId] || letterTemplates["ban-be"];
        const content = template.content[Math.floor(Math.random() * template.content.length)];

        return {
            date: `Ngày ${dateStr}`,
            recipient: template.recipient,
            greeting: template.greeting,
            content: content,
            closing: template.closing
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

        if (letterRecipient) letterRecipient.textContent = letter.recipient;
        if (letterDate) letterDate.textContent = letter.date;
        if (letterGreeting) letterGreeting.textContent = letter.greeting;
        if (letterContent) letterContent.innerHTML = letter.content;
        if (letterClosing) letterClosing.textContent = letter.closing;

        if (moneyAmount) moneyAmount.textContent = formatCurrency(amount);

        initScratchCard();
    }

    // Get Random Amount with weighted probabilities
    function getRandomAmount() {
        const random = Math.random() * 100;

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

    // Format Currency
    function formatCurrency(amount) {
        return amount.toLocaleString("vi-VN") + " ₫";
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

        // Create scratch surface
        ctx.fillStyle = "#E0E0E0";
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        // Add dot pattern
        ctx.fillStyle = "#FFFFFF";
        for (let x = 10; x < scratchCanvas.width; x += 25) {
            for (let y = 10; y < scratchCanvas.height; y += 25) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Add gradient overlay
        const gradient = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        // Add text
        ctx.fillStyle = "#8B4513";
        ctx.font = "bold 18px 'Noto Serif', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Đón nhận may mắn đầu năm.", scratchCanvas.width / 2, scratchCanvas.height / 2);

        // Mouse events
        scratchCanvas.addEventListener("mousedown", handleMouseDown);
        scratchCanvas.addEventListener("mousemove", handleMouseMove);
        scratchCanvas.addEventListener("mouseup", handleMouseUp);

        // Touch events
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
        if (specificSelection) specificSelection.classList.add("hidden");
        if (relationshipSelection) relationshipSelection.classList.remove("hidden");

        if (selectedRelationship) {
            selectedRelationship.classList.remove("selected");
            selectedRelationship = null;
        }
        if (selectedSpecific) {
            selectedSpecific.classList.remove("selected");
            selectedSpecific = null;
        }
        if (selectedAge) {
            selectedAge.classList.remove("selected");
            selectedAge = null;
        }

        updateStepIndicator(1);
        if (relationshipGrid) relationshipGrid.innerHTML = "";
        initRelationshipSelection();
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && resultModal && !resultModal.classList.contains("hidden")) {
            closeModal();
        }
    });

    initRelationshipSelection();
});