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
            { id: "ong-noi", name: "Ông Nội", icon: "fa-solid fa-male" },
            { id: "ba-noi", name: "Bà Nội", icon: "fa-solid fa-female" },
            { id: "ong-ngoai", name: "Ông Ngoại", icon: "fa-solid fa-male" },
            { id: "ba-ngoai", name: "Bà Ngoại", icon: "fa-solid fa-female" },
            { id: "ong-ba-noi", name: "Ông Bà Nội", icon: "fa-solid fa-people-arrows" },
            { id: "ong-ba-ngoai", name: "Ông Bà Ngoại", icon: "fa-solid fa-people-arrows" },
            { id: "ong-ba", name: "Ông Bà (chung)", icon: "fa-solid fa-users" },
            { id: "ong-coi", name: "Ông Cụ (ông cố)", icon: "fa-solid fa-male" },
            { id: "ba-coi", name: "Bà Cụ (bà cố)", icon: "fa-solid fa-female" },
            { id: "ong-bo", name: "Ông Bố (ông nội ngoại chung)", icon: "fa-solid fa-male" },
            { id: "ba-bo", name: "Bà Bố (bà nội ngoại chung)", icon: "fa-solid fa-female" }
        ],
        parents: [
            { id: "bo", name: "Bố (ruột)", icon: "fa-solid fa-male" },
            { id: "me", name: "Mẹ (ruột)", icon: "fa-solid fa-female" },
            { id: "bo-me", name: "Bố Mẹ (ruột)", icon: "fa-solid fa-people-arrows" },
            { id: "bo-day", name: "Bố Dượng", icon: "fa-solid fa-male" },
            { id: "me-ke", name: "Mẹ Kế", icon: "fa-solid fa-female" },
            { id: "bo-nuoi", name: "Bố Nuôi", icon: "fa-solid fa-male" },
            { id: "me-nuoi", name: "Mẹ Nuôi", icon: "fa-solid fa-female" },
            { id: "bo-me-nuoi", name: "Bố Mẹ Nuôi", icon: "fa-solid fa-people-arrows" }
        ],
        children: [
            { id: "con-trai-ca", name: "Con Trai Cả", icon: "fa-solid fa-child" },
            { id: "con-trai-thu", name: "Con Trai Thứ", icon: "fa-solid fa-child" },
            { id: "con-trai-ut", name: "Con Trai Út", icon: "fa-solid fa-child" },
            { id: "con-trai", name: "Con Trai (chung)", icon: "fa-solid fa-child" },
            { id: "con-gai-ca", name: "Con Gái Cả", icon: "fa-solid fa-child-dress" },
            { id: "con-gai-thu", name: "Con Gái Thứ", icon: "fa-solid fa-child-dress" },
            { id: "con-gai-ut", name: "Con Gái Út", icon: "fa-solid fa-child-dress" },
            { id: "con-gai", name: "Con Gái (chung)", icon: "fa-solid fa-child-dress" },
            { id: "cac-con", name: "Các Con (chung)", icon: "fa-solid fa-children" },
            { id: "con-nuoi", name: "Con Nuôi", icon: "fa-solid fa-child" }
        ],
        siblings: [
            { id: "anh-ca", name: "Anh Cả", icon: "fa-solid fa-male" },
            { id: "anh-hai", name: "Anh Hai", icon: "fa-solid fa-male" },
            { id: "anh", name: "Anh (chung)", icon: "fa-solid fa-male" },
            { id: "chi-ca", name: "Chị Cả", icon: "fa-solid fa-female" },
            { id: "chi-hai", name: "Chị Hai", icon: "fa-solid fa-female" },
            { id: "chi", name: "Chị (chung)", icon: "fa-solid fa-female" },
            { id: "em-trai-ca", name: "Em Trai Cả", icon: "fa-solid fa-male" },
            { id: "em-trai", name: "Em Trai (chung)", icon: "fa-solid fa-male" },
            { id: "em-gai-ca", name: "Em Gái Cả", icon: "fa-solid fa-female" },
            { id: "em-gai", name: "Em Gái (chung)", icon: "fa-solid fa-female" },
            { id: "cac-anh-chi-em", name: "Các Anh Chị Em", icon: "fa-solid fa-users" },
            { id: "anh-em-ket-nghia", name: "Anh Em Kết Nghĩa", icon: "fa-solid fa-handshake" }
        ],
        aunt_uncle: [
            { id: "co", name: "Cô (em gái mẹ)", icon: "fa-solid fa-female" },
            { id: "co-ca", name: "Cô Cả", icon: "fa-solid fa-female" },
            { id: "di", name: "Dì (em gái bố)", icon: "fa-solid fa-female" },
            { id: "di-ca", name: "Dì Cả", icon: "fa-solid fa-female" },
            { id: "chu", name: "Chú (em trai bố)", icon: "fa-solid fa-male" },
            { id: "chu-ca", name: "Chú Cả", icon: "fa-solid fa-male" },
            { id: "bac-trai", name: "Bác Trai (anh trai bố/mẹ)", icon: "fa-solid fa-male" },
            { id: "bac-gai", name: "Bác Gái (chị gái bố/mẹ)", icon: "fa-solid fa-female" },
            { id: "bac", name: "Bác (chung)", icon: "fa-solid fa-users" },
            { id: "cau", name: "Cậu (anh trai mẹ)", icon: "fa-solid fa-male" },
            { id: "mo", name: "Mợ (vợ cậu)", icon: "fa-solid fa-female" }
        ],
        friends: [
            { id: "ban-than-nam", name: "Bạn Thân Nam", icon: "fa-solid fa-male" },
            { id: "ban-than-nu", name: "Bạn Thân Nữ", icon: "fa-solid fa-female" },
            { id: "ban-nam", name: "Bạn Nam (chung)", icon: "fa-solid fa-male" },
            { id: "ban-nu", name: "Bạn Nữ (chung)", icon: "fa-solid fa-female" },
            { id: "ban-cung-lop", name: "Bạn Cùng Lớp", icon: "fa-solid fa-user-graduate" },
            { id: "ban-cung-truong", name: "Bạn Cùng Trường", icon: "fa-solid fa-school" },
            { id: "ban-cung-cong-ty", name: "Bạn Cùng Công Ty", icon: "fa-solid fa-briefcase" },
            { id: "ban-hoc-cu", name: "Bạn Học Cũ", icon: "fa-solid fa-book-open" },
            { id: "ban-hang-xom", name: "Bạn Hàng Xóm", icon: "fa-solid fa-home" },
            { id: "ban-be", name: "Bạn Bè (chung)", icon: "fa-solid fa-user-group" },
            { id: "ban-quen-tren-mang", name: "Bạn Quen Trên Mạng", icon: "fa-solid fa-globe" }
        ],
        colleagues: [
            { id: "dong-nghiep-nam", name: "Đồng Nghiệp Nam", icon: "fa-solid fa-male" },
            { id: "dong-nghiep-nu", name: "Đồng Nghiệp Nữ", icon: "fa-solid fa-female" },
            { id: "sep-nam", name: "Sếp Nam", icon: "fa-solid fa-user-tie" },
            { id: "sep-nu", name: "Sếp Nữ", icon: "fa-solid fa-user-tie" },
            { id: "dong-nghiep-cap-duoi", name: "Đồng Nghiệp Cấp Dưới", icon: "fa-solid fa-users" },
            { id: "dong-nghiep-cap-tren", name: "Đồng Nghiệp Cấp Trên", icon: "fa-solid fa-users" },
            { id: "dong-nghiep-cung-phong", name: "Đồng Nghiệp Cùng Phòng Ban", icon: "fa-solid fa-building" },
            { id: "dong-nghiep-cung-du-an", name: "Đồng Nghiệp Cùng Dự Án", icon: "fa-solid fa-tasks" },
            { id: "dong-nghiep", name: "Đồng Nghiệp (chung)", icon: "fa-solid fa-handshake" }
        ],
        lovers: [
            { id: "ban-trai", name: "Bạn Trai", icon: "fa-solid fa-male" },
            { id: "ban-gai", name: "Bạn Gái", icon: "fa-solid fa-female" },
            { id: "nguoi-yeu", name: "Người Yêu", icon: "fa-solid fa-heart" },
            { id: "vo", name: "Vợ", icon: "fa-solid fa-female" },
            { id: "chong", name: "Chồng", icon: "fa-solid fa-male" },
            { id: "vo-chong", name: "Vợ/Chồng", icon: "fa-solid fa-ring" },
            { id: "nguoi-yeu-cu", name: "Người Yêu Cũ", icon: "fa-solid fa-heart-broken" },
            { id: "nguoi-yeu-moi", name: "Người Yêu Mới", icon: "fa-solid fa-heart" },
            { id: "nguoi-dang-yeu", name: "Người Đang Yêu (chưa chính thức)", icon: "fa-solid fa-heart" }
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

    const letterTemplates = {
        ong: {
            greeting: "Kính gửi Ông,",
            recipient: "Gửi Ông",
            content: [
                `Kính thưa Ông, <br><br>Xuân sang mang theo vạn điều tốt lành, cháu xin kính chúc Ông trăm tuổi, sức khỏe dồi dào, tinh thần an lạc như núi non. Ông là chỗ dựa tinh thần vững chắc của cả gia đình. Cháu luôn khắc ghi những lời dạy bảo ân cần của Ông. Chúc Ông năm mới an khang thịnh vượng, vui khỏe bên con cháu!`,
                `Thưa Ông kính yêu, <br><br>Tết đến xuân về, cháu kính chúc Ông phúc thọ miên trường, sống lâu trăm tuổi như cây tùng bách. Những bài học Ông dạy cháu về lòng nhân ái, sự kiên trì vẫn là kim chỉ nam cho cuộc đời cháu. Mong Ông luôn minh mẫn, vui vẻ. Chúc Ông năm mới vạn sự như ý!`,
                `Kính gửi Ông, <br><br>Năm mới 2026, cháu chúc Ông tuổi cao sức khỏe tốt, phúc lộc đầy nhà, bình an mãi mãi. Cháu tự hào vì có một người ông tuyệt vời như Ông. Mong Ông đón xuân mới thật an vui, sum vầy bên gia đình!`,
                `Thưa Ông, <br><br>Cháu xin kính chúc Ông năm mới sức khỏe như núi Thái Sơn, tài lộc như biển Đông. Cháu hứa sẽ cố gắng học tập, làm việc thật tốt để Ông tự hào. Chúc Ông xuân mới phát tài phát lộc, trăm điều như ý!`,
                `Kính thưa Ông, <br><br>Tết này cháu chúc Ông sống thọ trăm năm, tinh thần lạc quan, tuổi già hạnh phúc. Những kỷ niệm bên Ông là kho báu quý giá nhất của cháu. Chúc Ông năm mới an khang, tràn đầy niềm vui!`,
                `Gửi Ông kính yêu, <br><br>Cháu chúc Ông năm mới mạnh khỏe, sống vui, phúc đức tràn đầy. Cháu biết ơn Ông vì đã truyền lại cho cháu những giá trị sống đẹp. Mong Ông luôn bình an bên con cháu!`,
                `Kính thưa Ông, <br><br>Xuân mới đến, cháu kính chúc Ông trăm năm trường thọ, sức khỏe dồi dào, tâm hồn thanh thản. Ông là người anh hùng thầm lặng trong lòng cháu. Chúc Ông năm mới vạn phúc lộc, an vui!`,
                `Thưa Ông, <br><br>Cháu chúc Ông năm mới tuổi cao niên khỏe, phúc lộc viên mãn, gia đình sum họp. Những câu chuyện Ông kể vẫn là nguồn cảm hứng lớn lao cho cháu. Mong Ông luôn cười thật tươi!`,
                `Kính gửi Ông, <br><br>Tết này cháu chúc Ông sống lâu trăm tuổi, khỏe mạnh, an nhàn. Cháu sẽ cố gắng thật tốt để đền đáp công ơn dạy dỗ của Ông. Chúc Ông năm mới hạnh phúc!`,
                `Gửi Ông yêu quý, <br><br>Cháu chúc Ông năm mới bình an, sức khỏe dồi dào, phúc thọ trường tồn. Ông mãi là điểm tựa vững chắc trong tim cháu!`
            ],
            closing: "Cháu kính chúc Ông"
        },

        ba: {
            greeting: "Kính gửi Bà,",
            recipient: "Gửi Bà",
            content: [
                `Kính thưa Bà, <br><br>Xuân về hoa nở khắp nơi, cháu xin kính chúc Bà sức khỏe dồi dào, sống lâu trăm tuổi, phúc lộc viên mãn. Bà là ánh sáng ấm áp, là người ru cháu ngủ mỗi đêm. Cháu biết ơn Bà vô cùng. Chúc Bà năm mới an vui, hạnh phúc!`,
                `Thưa Bà yêu quý, <br><br>Tết đến xuân sang, cháu chúc Bà tuổi thọ như núi non, sức khỏe như suối nguồn mát lành. Những món ăn Bà nấu, những lời ru ngọt ngào vẫn mãi trong tim cháu. Mong Bà luôn vui vẻ, khỏe mạnh bên con cháu!`,
                `Kính gửi Bà, <br><br>Năm mới 2026, cháu chúc Bà minh mẫn, tràn đầy sức sống, hạnh phúc viên mãn. Cháu sẽ cố gắng thật tốt để đền đáp công ơn nuôi dưỡng của Bà. Chúc Bà xuân mới an khang thịnh vượng!`,
                `Thưa Bà kính yêu, <br><br>Cháu chúc Bà năm mới trăm điều may mắn, sống thọ, khỏe mạnh, tinh thần lạc quan. Bà là người phụ nữ tuyệt vời nhất mà cháu từng biết. Mong Bà luôn cười thật tươi!`,
                `Kính thưa Bà, <br><br>Tết này cháu chúc Bà phúc lộc tràn đầy, trăm năm hạnh phúc, tuổi già an nhàn. Cháu luôn nhớ những ngày được Bà cõng, được Bà kể chuyện cổ tích. Chúc Bà năm mới thật nhiều niềm vui!`,
                `Gửi Bà, <br><br>Cháu chúc Bà năm mới khỏe mạnh, vui vẻ, sống lâu trăm tuổi. Cảm ơn Bà vì tất cả tình thương vô bờ. Cháu yêu Bà rất nhiều!`,
                `Kính thưa Bà, <br><br>Xuân mới đến, cháu kính chúc Bà trăm năm trường thọ, tâm hồn thanh thản, phúc đức đầy nhà. Bà là nguồn yêu thương lớn nhất của cháu!`,
                `Thưa Bà, <br><br>Cháu chúc Bà năm mới an khang, sức khỏe dồi dào, gia đình sum họp. Những kỷ niệm bên Bà là kho báu vô giá!`,
                `Kính gửi Bà yêu quý, <br><br>Tết này cháu chúc Bà sống thọ, khỏe mạnh, tuổi già hạnh phúc. Cháu hứa sẽ luôn làm Bà tự hào!`,
                `Gửi Bà, <br><br>Cháu chúc Bà năm mới vạn phúc lộc, bình an mãi mãi. Bà mãi là người bà tuyệt vời trong lòng cháu!`
            ],
            closing: "Cháu kính chúc Bà"
        },

        "ong-ba": {
            greeting: "Kính gửi Ông Bà,",
            recipient: "Gửi Ông Bà",
            content: [
                `Kính thưa Ông Bà, <br><br>Xuân về mang theo niềm vui mới, cháu kính chúc Ông Bà sức khỏe dồi dào, sống lâu trăm tuổi, phúc lộc như biển Đông. Ông Bà là trụ cột, là bóng mát che chở cho cả gia đình. Cháu biết ơn Ông Bà vô cùng. Chúc Ông Bà năm mới an khang, sum vầy!`,
                `Thưa Ông Bà kính yêu, <br><br>Tết đến xuân sang, cháu chúc Ông Bà tuổi thọ miên trường, vạn sự như ý, bình an mãi mãi. Những lời dạy của Ông Bà là hành trang quý giá nhất cho cuộc đời cháu. Mong Ông Bà luôn vui khỏe!`,
                `Kính gửi Ông Bà, <br><br>Năm mới 2026, cháu chúc Ông Bà trăm năm hạnh phúc, sức khỏe như núi, phúc đức như sông dài. Cháu hứa sẽ cố gắng thật tốt để Ông Bà tự hào. Chúc Ông Bà xuân mới phát tài phát lộc!`,
                `Thưa Ông Bà, <br><br>Cháu kính chúc Ông Bà năm mới an khang thịnh vượng, sống thọ, khỏe mạnh, tinh thần lạc quan. Cháu luôn nhớ những ngày được Ông Bà cưng chiều, kể chuyện xưa. Mong Ông Bà luôn vui vẻ!`,
                `Kính thưa Ông Bà, <br><br>Tết này cháu chúc Ông Bà vạn phúc lộc, trăm điều may mắn, tuổi già an nhàn. Cháu biết ơn Ông Bà đã nuôi dạy cháu khôn lớn. Chúc Ông Bà năm mới sum vầy, hạnh phúc viên mãn!`,
                `Gửi Ông Bà yêu quý, <br><br>Cháu chúc Ông Bà năm mới mạnh khỏe, sống vui, phúc thọ trường tồn. Ông Bà là nguồn cảm hứng lớn nhất của cháu!`,
                `Kính thưa Ông Bà, <br><br>Xuân mới đến, cháu chúc Ông Bà trăm năm trường thọ, tâm hồn thanh thản, gia đình ấm no. Cháu sẽ luôn cố gắng để Ông Bà tự hào!`,
                `Thưa Ông Bà, <br><br>Cháu chúc Ông Bà năm mới an vui, khỏe mạnh, phúc lộc đầy nhà. Mong Ông Bà luôn bình an bên con cháu!`,
                `Kính gửi Ông Bà, <br><br>Tết này cháu chúc Ông Bà sống thọ trăm tuổi, hạnh phúc viên mãn. Cháu yêu Ông Bà nhất trên đời!`,
                `Gửi Ông Bà kính yêu, <br><br>Cháu chúc Ông Bà năm mới vạn sự như ý, tuổi già an nhàn, phúc đức tràn đầy!`
            ],
            closing: "Cháu kính chúc Ông Bà"
        },

        bo: {
            greeting: "Kính gửi Bố,",
            recipient: "Gửi Bố",
            content: [
                `Gửi Bố yêu quý, <br><br>Xuân về đầy ắp hy vọng, con xin chúc Bố sức khỏe dồi dào, công việc thuận lợi, thành công rực rỡ. Bố là người hùng, là chỗ dựa vững chắc của con. Con biết ơn Bố đã vất vả nuôi con khôn lớn. Năm mới con hứa sẽ cố gắng hơn để Bố tự hào!`,
                `Thưa Bố kính yêu, <br><br>Tết đến xuân sang, con chúc Bố năm mới an khang thịnh vượng, phát tài phát lộc, vạn sự như ý. Bố là tấm gương sáng để con noi theo. Con luôn trân trọng từng lời dạy của Bố!`,
                `Kính gửi Bố, <br><br>Năm mới 2026, con chúc Bố tuổi thọ, sức khỏe tốt, công danh thăng tiến. Con biết Bố đã hy sinh rất nhiều vì con. Con hứa sẽ sống tốt, làm việc tốt để báo đáp công ơn!`,
                `Thưa Bố, <br><br>Con chúc Bố năm mới trăm điều may mắn, gia đình luôn ấm no. Bố là người đàn ông tuyệt vời nhất mà con từng biết. Mong Bố luôn cười thật tươi!`,
                `Gửi Bố yêu quý, <br><br>Tết này con chúc Bố sức khỏe như núi, tài lộc như biển. Con sẽ cố gắng học tập, làm việc thật tốt để Bố không phải lo lắng. Chúc Bố năm mới an vui, hạnh phúc!`,
                `Kính thưa Bố, <br><br>Con xin chúc Bố năm mới vạn phúc lộc, sống thọ trăm năm. Cảm ơn Bố vì tất cả. Con yêu Bố rất nhiều!`,
                `Gửi Bố kính yêu, <br><br>Xuân mới đến, con chúc Bố mạnh khỏe, thành công, gia đình sum vầy. Bố mãi là người hùng trong lòng con!`,
                `Thưa Bố, <br><br>Con chúc Bố năm mới an khang, phúc lộc đầy nhà, tinh thần lạc quan. Con sẽ luôn cố gắng để Bố tự hào!`,
                `Kính gửi Bố, <br><br>Tết này con chúc Bố trăm năm hạnh phúc, khỏe mạnh, an vui. Yêu Bố nhất trên đời!`,
                `Gửi Bố yêu quý, <br><br>Con chúc Bố năm mới phát tài phát lộc, sống thọ, bình an mãi mãi!`
            ],
            closing: "Con kính chúc Bố"
        },

        me: {
            greeting: "Kính gửi Mẹ,",
            recipient: "Gửi Mẹ",
            content: [
                `Gửi Mẹ yêu thương, <br><br>Xuân sang muôn hoa khoe sắc, con xin chúc Mẹ luôn xinh đẹp, sức khỏe dồi dào, tràn đầy niềm vui. Tình yêu của Mẹ như ánh nắng sưởi ấm trái tim con. Con biết ơn Mẹ đã hy sinh cả đời vì con. Chúc Mẹ năm mới an khang, hạnh phúc!`,
                `Kính thưa Mẹ, <br><br>Tết đến xuân về, con chúc Mẹ vạn sự như ý, sức khỏe tốt, gia đình luôn ấm no. Mẹ là người phụ nữ tuyệt vời nhất. Con hứa sẽ cố gắng thật tốt để Mẹ tự hào. Yêu Mẹ nhiều lắm!`,
                `Gửi Mẹ kính yêu, <br><br>Năm mới 2026, con chúc Mẹ tuổi thọ, khỏe mạnh, luôn tươi trẻ. Những bữa cơm Mẹ nấu, những đêm Mẹ thức chăm con ốm... con sẽ không bao giờ quên. Chúc Mẹ xuân mới thật nhiều niềm vui!`,
                `Thưa Mẹ, <br><br>Con chúc Mẹ năm mới phúc lộc tràn đầy, sống thọ trăm năm. Mẹ là nguồn động lực lớn nhất của con. Mong Mẹ luôn cười thật tươi!`,
                `Kính gửi Mẹ, <br><br>Tết này con chúc Mẹ trăm điều may mắn, hạnh phúc viên mãn. Con sẽ cố gắng học tập, làm việc tốt để báo đáp công ơn sinh thành dưỡng dục của Mẹ. Yêu Mẹ!`,
                `Gửi Mẹ yêu quý, <br><br>Con chúc Mẹ năm mới an vui, khỏe mạnh, thanh xuân mãi không phai. Cảm ơn Mẹ vì tất cả. Con yêu Mẹ nhất trên đời!`,
                `Kính thưa Mẹ, <br><br>Xuân mới đến, con chúc Mẹ mạnh khỏe, hạnh phúc, gia đình sum vầy. Mẹ mãi là người mẹ tuyệt vời trong lòng con!`,
                `Thưa Mẹ, <br><br>Con chúc Mẹ năm mới an khang, phúc lộc đầy nhà, tinh thần lạc quan. Con sẽ luôn cố gắng để Mẹ tự hào!`,
                `Gửi Mẹ, <br><br>Tết này con chúc Mẹ sống thọ trăm tuổi, khỏe mạnh, an vui. Yêu Mẹ vô cùng!`,
                `Kính gửi Mẹ yêu thương, <br><br>Con chúc Mẹ năm mới vạn phúc lộc, bình an mãi mãi. Mẹ là ánh sáng của đời con!`
            ],
            closing: "Con kính chúc Mẹ"
        },

        "bo-me": {
            greeting: "Kính gửi Bố Mẹ,",
            recipient: "Gửi Bố Mẹ",
            content: [
                `Gửi Bố Mẹ yêu quý, <br><br>Xuân về với muôn vàn niềm vui, con xin chúc Bố Mẹ sức khỏe dồi dào, hạnh phúc viên mãn, gia đình luôn ấm no. Bố Mẹ là tất cả của con. Con biết ơn Bố Mẹ đã hy sinh rất nhiều. Năm mới con hứa sẽ cố gắng hơn để Bố Mẹ tự hào!`,
                `Kính thưa Bố Mẹ, <br><br>Tết đến xuân sang, con chúc Bố Mẹ an khang thịnh vượng, phát tài phát lộc, vạn sự như ý. Con luôn trân trọng tình yêu thương vô bờ của Bố Mẹ. Chúc gia đình mình năm mới sum vầy, hạnh phúc!`,
                `Gửi Bố Mẹ kính yêu, <br><br>Năm mới 2026, con chúc Bố Mẹ sống thọ, khỏe mạnh, tinh thần lạc quan. Con sẽ cố gắng học tập, làm việc thật tốt để báo đáp công ơn sinh thành. Yêu Bố Mẹ rất nhiều!`,
                `Thưa Bố Mẹ, <br><br>Con chúc Bố Mẹ năm mới trăm điều may mắn, phúc lộc tràn đầy. Gia đình là nơi con thấy bình yên nhất. Mong Bố Mẹ luôn vui khỏe!`,
                `Kính gửi Bố Mẹ, <br><br>Tết này con chúc Bố Mẹ vạn phúc lộc, trăm năm hạnh phúc. Cảm ơn Bố Mẹ vì tất cả. Con hứa sẽ sống tốt, làm người tử tế!`,
                `Gửi Bố Mẹ, <br><br>Con chúc Bố Mẹ năm mới an vui, khỏe mạnh, gia đình luôn đầm ấm. Yêu Bố Mẹ nhất trên đời!`,
                `Kính thưa Bố Mẹ, <br><br>Xuân mới đến, con chúc Bố Mẹ mạnh khỏe, thành công, bình an mãi mãi. Bố Mẹ là điểm tựa lớn nhất của con!`,
                `Thưa Bố Mẹ, <br><br>Con chúc Bố Mẹ năm mới phúc thọ trường tồn, gia đình sum họp. Con sẽ luôn cố gắng để Bố Mẹ tự hào!`,
                `Gửi Bố Mẹ yêu quý, <br><br>Tết này con chúc Bố Mẹ sống thọ trăm tuổi, hạnh phúc viên mãn. Yêu Bố Mẹ vô cùng!`,
                `Kính gửi Bố Mẹ, <br><br>Con chúc Bố Mẹ năm mới vạn sự như ý, tuổi già an nhàn, phúc đức đầy nhà!`
            ],
            closing: "Con kính chúc Bố Mẹ"
        },

        "con-trai": {
            greeting: "Gửi con trai yêu quý,",
            recipient: "Gửi con trai",
            content: [
                `Con trai của bố, <br><br>Xuân về, bố chúc con khỏe mạnh, học hành tấn tới, trở thành người đàn ông bản lĩnh, trách nhiệm. Con là niềm tự hào lớn nhất của bố. Mong con luôn giữ tinh thần lạc quan, sống tốt. Năm mới thành công rực rỡ nhé con!`,
                `Gửi con yêu, <br><br>Tết đến xuân sang, bố chúc con năm mới vạn sự như ý, học tập tiến bộ, gặp nhiều may mắn. Con là tương lai của gia đình. Bố tin con sẽ làm được những điều tuyệt vời!`,
                `Con trai ngoan, <br><br>Năm mới 2026, bố chúc con sức khỏe dồi dào, thành công trong mọi việc. Hãy luôn giữ bản lĩnh, sống ngay thẳng. Bố luôn ở bên con!`,
                `Gửi con trai, <br><br>Bố chúc con năm mới phát tài phát lộc, học hành giỏi giang, trưởng thành hơn nữa. Con là niềm vui lớn nhất của bố!`,
                `Con yêu quý, <br><br>Tết này bố chúc con trăm điều may mắn, khỏe mạnh, vui vẻ. Hãy cố gắng hết mình nhé con trai!`,
                `Gửi con trai yêu, <br><br>Bố chúc con năm mới mạnh khỏe, thành công, hạnh phúc. Con là món quà quý giá nhất bố nhận được từ cuộc đời!`,
                `Con trai của bố, <br><br>Bố chúc con năm mới an khang, học giỏi, trở thành người đàn ông tuyệt vời. Bố tự hào về con!`,
                `Gửi con, <br><br>Tết này bố chúc con vạn sự như ý, sức khỏe tốt, tương lai sáng ngời!`,
                `Con trai ngoan, <br><br>Bố chúc con năm mới phát triển toàn diện, khỏe mạnh, thành công rực rỡ!`,
                `Gửi con trai yêu quý, <br><br>Bố chúc con năm mới trăm điều tốt lành, luôn vui vẻ, bản lĩnh!`
            ],
            closing: "Yêu con"
        },

        "con-gai": {
            greeting: "Gửi con gái yêu quý,",
            recipient: "Gửi con gái",
            content: [
                `Con gái của bố, <br><br>Xuân sang hoa nở rực rỡ, bố chúc con luôn xinh đẹp, khỏe mạnh, học hành tiến bộ. Con là công chúa nhỏ, là niềm vui mỗi ngày của bố. Mong con tự tin, hạnh phúc. Năm mới thật nhiều điều tốt lành nhé!`,
                `Gửi công chúa nhỏ, <br><br>Tết đến xuân về, bố chúc con năm mới an khang, vạn sự như ý. Con là ánh sáng trong cuộc đời bố. Hãy luôn giữ nụ cười tươi và trái tim ấm áp!`,
                `Con gái yêu, <br><br>Năm mới 2026, bố chúc con học giỏi, khỏe mạnh, gặp nhiều may mắn. Bố luôn tự hào về con. Yêu con nhiều lắm!`,
                `Gửi con gái, <br><br>Bố chúc con năm mới xinh đẹp, thành công, hạnh phúc viên mãn. Con là món quà quý giá nhất của bố!`,
                `Con yêu quý, <br><br>Tết này bố chúc con trăm điều tốt đẹp, luôn vui vẻ, khỏe mạnh. Bố yêu con nhất trên đời!`,
                `Gửi con gái ngoan, <br><br>Bố chúc con năm mới phát tài phát lộc, sống vui, thành công rực rỡ. Hãy luôn là cô gái mạnh mẽ và dịu dàng nhé!`,
                `Con gái của bố, <br><br>Bố chúc con năm mới an vui, học giỏi, xinh đẹp mãi mãi. Con là niềm tự hào lớn nhất!`,
                `Gửi công chúa nhỏ, <br><br>Tết này bố chúc con vạn sự như ý, sức khỏe tốt, tương lai rạng ngời!`,
                `Con gái yêu, <br><br>Bố chúc con năm mới hạnh phúc, khỏe mạnh, luôn tươi cười!`,
                `Gửi con gái yêu quý, <br><br>Bố chúc con năm mới trăm điều may mắn, thành công, hạnh phúc viên mãn!`
            ],
            closing: "Yêu con"
        },

        "cac-con": {
            greeting: "Gửi các con yêu quý,",
            recipient: "Gửi các con",
            content: [
                `Gửi các con ngoan, <br><br>Xuân về với muôn màu sắc tươi vui, bố chúc các con khỏe mạnh, học hành chăm ngoan, vui vẻ. Các con là niềm tự hào và hạnh phúc lớn nhất của bố. Mong các con luôn yêu thương, đùm bọc nhau. Năm mới sum vầy, ấm áp!`,
                `Các con yêu, <br><br>Tết đến xuân sang, bố chúc các con năm mới an khang, thành công rực rỡ. Gia đình là nơi các con luôn được yêu thương nhất. Bố tin các con sẽ làm được nhiều điều tuyệt vời!`,
                `Gửi các con, <br><br>Năm mới 2026, bố chúc các con sức khỏe dồi dào, học tập tiến bộ, gặp nhiều may mắn. Hãy luôn giữ tinh thần lạc quan và trái tim nhân hậu!`,
                `Các con ngoan, <br><br>Bố chúc các con năm mới vạn sự như ý, gia đình luôn hạnh phúc. Yêu các con rất nhiều!`,
                `Gửi các con yêu quý, <br><br>Tết này bố chúc các con trăm điều tốt lành, khỏe mạnh, vui vẻ. Bố luôn ở bên các con!`,
                `Các con của bố, <br><br>Bố chúc các con năm mới phát tài phát lộc, học giỏi, trưởng thành. Các con là nguồn sống lớn nhất của bố!`,
                `Gửi các con, <br><br>Bố chúc các con năm mới an khang, phát triển toàn diện, hạnh phúc viên mãn!`,
                `Các con yêu quý, <br><br>Tết này bố chúc các con vạn sự như ý, sức khỏe tốt, tương lai sáng ngời!`,
                `Gửi các con ngoan, <br><br>Bố chúc các con năm mới trăm điều may mắn, luôn vui vẻ, đoàn kết!`,
                `Các con của bố, <br><br>Bố chúc các con năm mới khỏe mạnh, thành công rực rỡ, gia đình ấm no!`
            ],
            closing: "Thương yêu các con"
        },

        anh: {
            greeting: "Gửi anh,",
            recipient: "Gửi anh",
            content: [
                `Gửi anh trai thân yêu, <br><br>Xuân về tươi đẹp, em chúc anh sức khỏe, công việc thuận lợi, thành công vượt bậc. Anh là người anh tốt mà em luôn tự hào. Chúc anh năm mới gặp nhiều may mắn, gia đình hạnh phúc!`,
                `Gửi anh, <br><br>Tết đến xuân về, em chúc anh vạn sự như ý, phát tài phát lộc. Anh luôn là tấm gương để em noi theo. Mong anh luôn khỏe mạnh, vui vẻ!`,
                `Anh trai yêu quý, <br><br>Năm mới 2026, em chúc anh công danh thăng tiến, sức khỏe dồi dào. Cảm ơn anh đã luôn che chở, bảo vệ em. Yêu anh nhiều lắm!`,
                `Gửi anh, <br><br>Em chúc anh năm mới an khang, thành công rực rỡ. Anh là người anh tuyệt vời nhất!`,
                `Anh yêu quý, <br><br>Em chúc anh năm mới mạnh khỏe, hạnh phúc, gia đình ấm no. Mong chúng ta luôn gắn bó như xưa!`,
                `Gửi anh trai, <br><br>Tết này em chúc anh trăm điều may mắn, sự nghiệp thăng hoa, bình an mãi mãi!`,
                `Anh thân yêu, <br><br>Em chúc anh năm mới phát tài phát lộc, sống vui, thành công!`,
                `Gửi anh, <br><br>Em chúc anh năm mới vạn phúc lộc, khỏe mạnh, hạnh phúc viên mãn!`,
                `Anh trai của em, <br><br>Tết này em chúc anh an khang thịnh vượng, gia đình sum vầy!`,
                `Gửi anh yêu quý, <br><br>Em chúc anh năm mới trăm điều tốt lành, luôn vui vẻ, bình an!`
            ],
            closing: "Thân mến"
        },

        chi: {
            greeting: "Gửi chị,",
            recipient: "Gửi chị",
            content: [
                `Gửi chị gái yêu quý, <br><br>Xuân sang muôn hoa khoe sắc, em chúc chị luôn xinh đẹp, sức khỏe dồi dào, công việc thuận lợi. Chị là người chị tuyệt vời mà em luôn yêu mến. Chúc chị năm mới thật nhiều hạnh phúc!`,
                `Gửi chị, <br><br>Tết đến xuân về, em chúc chị vạn sự như ý, phát tài phát lộc. Chị luôn là người em tin tưởng nhất. Mong chị luôn vui vẻ, gặp nhiều điều tốt lành!`,
                `Chị yêu quý, <br><br>Năm mới 2026, em chúc chị thành công rực rỡ, hạnh phúc viên mãn. Cảm ơn chị đã luôn quan tâm, chăm sóc em. Yêu chị nhiều lắm!`,
                `Gửi chị, <br><br>Em chúc chị năm mới an khang, xinh đẹp mãi mãi. Chị là người chị tuyệt vời nhất!`,
                `Chị gái thân yêu, <br><br>Em chúc chị năm mới khỏe mạnh, gia đình hạnh phúc, sự nghiệp thăng hoa!`,
                `Gửi chị, <br><br>Tết này em chúc chị trăm điều may mắn, sống vui, bình an!`,
                `Chị yêu quý, <br><br>Em chúc chị năm mới phát tài phát lộc, hạnh phúc viên mãn!`,
                `Gửi chị gái, <br><br>Em chúc chị năm mới vạn sự như ý, khỏe mạnh, an vui!`,
                `Chị của em, <br><br>Tết này em chúc chị an khang thịnh vượng, gia đình sum vầy!`,
                `Gửi chị thân yêu, <br><br>Em chúc chị năm mới trăm điều tốt lành, luôn tươi cười, hạnh phúc!`
            ],
            closing: "Thân mến"
        },

        "em-trai": {
            greeting: "Gửi em trai,",
            recipient: "Gửi em trai",
            content: [
                `Gửi em trai thân yêu, <br><br>Xuân về, anh chúc em khỏe mạnh, học hành giỏi giang, trở thành người đàn ông bản lĩnh. Em là niềm vui lớn của anh. Chúc em năm mới thành công, gặp nhiều may mắn!`,
                `Gửi em, <br><br>Tết đến xuân sang, anh chúc em vạn sự như ý, học tập tiến bộ. Em là người em tuyệt vời! Mong em luôn vui vẻ, tự tin!`,
                `Em trai yêu, <br><br>Năm mới 2026, anh chúc em sức khỏe dồi dào, thành công rực rỡ. Anh luôn ở bên em!`,
                `Gửi em trai, <br><br>Anh chúc em năm mới phát tài phát lộc, học giỏi, khỏe mạnh. Yêu em nhiều lắm!`,
                `Em trai ngoan, <br><br>Anh chúc em năm mới mạnh khỏe, trưởng thành, thành công. Anh tự hào về em!`,
                `Gửi em, <br><br>Tết này anh chúc em trăm điều may mắn, tương lai sáng ngời!`,
                `Em trai yêu quý, <br><br>Anh chúc em năm mới an khang, học giỏi, sống vui vẻ!`,
                `Gửi em trai, <br><br>Anh chúc em năm mới vạn sự như ý, khỏe mạnh, bình an!`,
                `Em của anh, <br><br>Tết này anh chúc em phát triển toàn diện, hạnh phúc viên mãn!`,
                `Gửi em trai thân yêu, <br><br>Anh chúc em năm mới trăm điều tốt lành, luôn bản lĩnh, thành công!`
            ],
            closing: "Thương em"
        },

        "em-gai": {
            greeting: "Gửi em gái,",
            recipient: "Gửi em gái",
            content: [
                `Gửi em gái yêu quý, <br><br>Xuân sang hoa nở rực rỡ, anh chúc em luôn xinh đẹp, khỏe mạnh, học hành tiến bộ. Em là công chúa nhỏ của anh. Mong em tự tin, hạnh phúc. Năm mới thật nhiều niềm vui nhé!`,
                `Gửi em, <br><br>Tết đến xuân về, anh chúc em năm mới an khang, vạn sự như ý. Em là niềm tự hào của anh. Yêu em nhiều lắm!`,
                `Em gái yêu, <br><br>Năm mới 2026, anh chúc em học giỏi, khỏe mạnh, gặp nhiều may mắn. Anh luôn ở bên em!`,
                `Gửi em gái, <br><br>Anh chúc em năm mới xinh đẹp, thành công, hạnh phúc viên mãn. Em là món quà quý giá nhất của anh!`,
                `Em gái ngoan, <br><br>Anh chúc em năm mới phát tài phát lộc, sống vui, luôn tươi cười!`,
                `Gửi em, <br><br>Tết này anh chúc em trăm điều tốt lành, tương lai rạng ngời!`,
                `Em gái yêu quý, <br><br>Anh chúc em năm mới an vui, học giỏi, xinh đẹp mãi mãi!`,
                `Gửi em gái, <br><br>Anh chúc em năm mới vạn sự như ý, khỏe mạnh, hạnh phúc!`,
                `Em của anh, <br><br>Tết này anh chúc em trăm điều may mắn, luôn vui vẻ!`,
                `Gửi em gái thân yêu, <br><br>Anh chúc em năm mới phát triển toàn diện, thành công rực rỡ!`
            ],
            closing: "Thương em"
        },

        co: {
            greeting: "Kính gửi Cô,",
            recipient: "Gửi Cô",
            content: [
                `Kính thưa Cô, <br><br>Xuân về tươi đẹp, cháu xin chúc Cô sức khỏe, gia đình hạnh phúc, công việc thuận lợi. Tình cảm của Cô dành cho cháu thật ấm áp. Cháu luôn biết ơn sự quan tâm của Cô. Chúc Cô năm mới gặp nhiều may mắn, vạn sự như ý!`,
                `Gửi Cô yêu quý, <br><br>Tết đến xuân sang, cháu chúc Cô năm mới an khang, xinh đẹp, tràn đầy niềm vui. Cô là người cháu luôn kính trọng. Mong Cô luôn khỏe mạnh, hạnh phúc bên gia đình!`,
                `Kính gửi Cô, <br><br>Năm mới 2026, cháu chúc Cô phúc lộc tràn đầy, sức khỏe dồi dào. Cảm ơn Cô vì đã luôn yêu thương, chăm sóc cháu như con ruột!`,
                `Thưa Cô, <br><br>Cháu chúc Cô năm mới vạn sự như ý, gia đình sum vầy, hạnh phúc viên mãn!`,
                `Kính thưa Cô, <br><br>Tết này cháu chúc Cô trăm điều may mắn, sống thọ, khỏe mạnh. Cháu yêu Cô nhiều lắm!`,
                `Gửi Cô, <br><br>Cháu chúc Cô năm mới an vui, bình an mãi mãi, phúc đức đầy nhà!`,
                `Kính gửi Cô yêu quý, <br><br>Xuân mới đến, cháu chúc Cô mạnh khỏe, thành công, gia đình ấm no!`,
                `Thưa Cô, <br><br>Cháu chúc Cô năm mới phát tài phát lộc, sống vui, hạnh phúc!`,
                `Kính thưa Cô, <br><br>Tết này cháu chúc Cô vạn phúc lộc, tuổi già an nhàn!`,
                `Gửi Cô kính yêu, <br><br>Cháu chúc Cô năm mới trăm điều tốt lành, luôn tươi cười!`
            ],
            closing: "Cháu kính chúc Cô"
        },

        di: {
            greeting: "Kính gửi Dì,",
            recipient: "Gửi Dì",
            content: [
                `Kính thưa Dì, <br><br>Xuân sang muôn hoa khoe sắc, cháu xin chúc Dì luôn xinh đẹp, sức khỏe, gia đình hạnh phúc. Dì luôn là người thân yêu của cháu. Cảm ơn Dì đã luôn quan tâm, chăm sóc cháu. Chúc Dì năm mới nhiều niềm vui, thành công rực rỡ!`,
                `Gửi Dì yêu quý, <br><br>Tết đến xuân về, cháu chúc Dì năm mới vạn sự như ý, phát tài phát lộc. Dì là người cháu luôn yêu mến. Mong Dì luôn vui vẻ, gặp nhiều điều tốt lành!`,
                `Kính gửi Dì, <br><br>Năm mới 2026, cháu chúc Dì khỏe mạnh, hạnh phúc, gia đình ấm no. Cháu biết ơn Dì vì tất cả tình thương!`,
                `Thưa Dì, <br><br>Cháu chúc Dì năm mới an khang, xinh đẹp mãi mãi!`,
                `Kính thưa Dì, <br><br>Tết này cháu chúc Dì trăm điều may mắn, sống thọ, vui vẻ!`,
                `Gửi Dì, <br><br>Cháu chúc Dì năm mới phát tài phát lộc, bình an mãi mãi!`,
                `Kính gửi Dì yêu quý, <br><br>Xuân mới đến, cháu chúc Dì mạnh khỏe, thành công, hạnh phúc viên mãn!`,
                `Thưa Dì, <br><br>Cháu chúc Dì năm mới vạn phúc lộc, gia đình sum vầy!`,
                `Kính thưa Dì, <br><br>Tết này cháu chúc Dì an vui, khỏe mạnh, tuổi già an nhàn!`,
                `Gửi Dì thân yêu, <br><br>Cháu chúc Dì năm mới trăm điều tốt lành, luôn tươi cười!`
            ],
            closing: "Cháu kính chúc Dì"
        },

        chu: {
            greeting: "Kính gửi Chú,",
            recipient: "Gửi Chú",
            content: [
                `Kính thưa Chú, <br><br>Xuân về đầy ắp hy vọng, cháu xin chúc Chú sức khỏe, công việc thăng tiến, gia đình hạnh phúc. Chú là người cháu luôn kính trọng. Cháu biết ơn những lời dạy bảo của Chú. Chúc Chú năm mới gặp nhiều may mắn, phát tài phát lộc!`,
                `Gửi Chú yêu quý, <br><br>Tết đến xuân sang, cháu chúc Chú năm mới vạn sự như ý, thành công rực rỡ. Chú luôn là tấm gương cho cháu noi theo. Mong Chú luôn khỏe mạnh, vui vẻ bên gia đình!`,
                `Kính gửi Chú, <br><br>Năm mới 2026, cháu chúc Chú phúc lộc tràn đầy, sức khỏe dồi dào!`,
                `Thưa Chú, <br><br>Cháu chúc Chú năm mới an khang thịnh vượng, gia đình hạnh phúc!`,
                `Kính thưa Chú, <br><br>Tết này cháu chúc Chú trăm điều tốt lành, sống thọ, khỏe mạnh!`,
                `Gửi Chú, <br><br>Cháu chúc Chú năm mới phát tài phát lộc, bình an mãi mãi!`,
                `Kính gửi Chú yêu quý, <br><br>Xuân mới đến, cháu chúc Chú mạnh khỏe, thành công, gia đình ấm no!`,
                `Thưa Chú, <br><br>Cháu chúc Chú năm mới vạn phúc lộc, sống vui!`,
                `Kính thưa Chú, <br><br>Tết này cháu chúc Chú an vui, khỏe mạnh, hạnh phúc viên mãn!`,
                `Gửi Chú thân yêu, <br><br>Cháu chúc Chú năm mới trăm điều may mắn, luôn bình an!`
            ],
            closing: "Cháu kính chúc Chú"
        },

        bac: {
            greeting: "Kính gửi Bác,",
            recipient: "Gửi Bác",
            content: [
                `Kính thưa Bác, <br><br>Xuân sang tươi đẹp, cháu xin chúc Bác sức khỏe dồi dào, gia đình hạnh phúc, công việc thuận buồm xuôi gió. Bác là người cháu luôn kính mến. Cảm ơn Bác đã luôn quan tâm đến cháu. Chúc Bác năm mới nhiều niềm vui, vạn sự như ý!`,
                `Gửi Bác yêu quý, <br><br>Tết đến xuân về, cháu chúc Bác năm mới an khang thịnh vượng, phát tài phát lộc. Bác luôn là người cháu tôn trọng. Mong Bác luôn vui vẻ, khỏe mạnh!`,
                `Kính gửi Bác, <br><br>Năm mới 2026, cháu chúc Bác sống thọ, hạnh phúc, phúc lộc đầy nhà!`,
                `Thưa Bác, <br><br>Cháu chúc Bác năm mới vạn sự như ý, gia đình sum vầy!`,
                `Kính thưa Bác, <br><br>Tết này cháu chúc Bác trăm điều may mắn, khỏe mạnh, an vui!`,
                `Gửi Bác, <br><br>Cháu chúc Bác năm mới phát tài phát lộc, bình an mãi mãi!`,
                `Kính gửi Bác yêu quý, <br><br>Xuân mới đến, cháu chúc Bác mạnh khỏe, thành công, gia đình ấm no!`,
                `Thưa Bác, <br><br>Cháu chúc Bác năm mới vạn phúc lộc, sống vui!`,
                `Kính thưa Bác, <br><br>Tết này cháu chúc Bác an khang, khỏe mạnh, hạnh phúc viên mãn!`,
                `Gửi Bác thân yêu, <br><br>Cháu chúc Bác năm mới trăm điều tốt lành, luôn tươi cười!`
            ],
            closing: "Cháu kính chúc Bác"
        },

        "ban-nam": {
            greeting: "Gửi bạn,",
            recipient: "Gửi bạn",
            content: [
                `Gửi bạn thân, <br><br>Xuân về rồi! Mình chúc bạn năm mới sức khỏe, thành công trong công việc, gặp nhiều may mắn. Tình bạn của chúng mình là món quà quý giá. Cảm ơn bạn đã luôn bên cạnh, chia sẻ mọi lúc. Chúc bạn năm mới thật nhiều niềm vui, hạnh phúc!`,
                `Gửi bạn, <br><br>Tết đến xuân sang, mình chúc bạn vạn sự như ý, công danh thăng tiến. Bạn là người bạn tốt nhất của mình. Mong chúng mình luôn là bạn tốt, cùng nhau vượt qua mọi thử thách!`,
                `Bạn thân yêu, <br><br>Năm mới 2026, mình chúc bạn phát tài phát lộc, sức khỏe dồi dào, sống vui vẻ!`,
                `Gửi bạn, <br><br>Mình chúc bạn năm mới an khang, gặp nhiều điều tốt lành. Tình bạn mãi bền chặt nhé!`,
                `Bạn ơi, <br><br>Tết này mình chúc bạn trăm điều may mắn, thành công rực rỡ!`,
                `Gửi bạn thân, <br><br>Mình chúc bạn năm mới khỏe mạnh, hạnh phúc, sự nghiệp thăng hoa!`,
                `Bạn yêu quý, <br><br>Tết này mình chúc bạn vạn phúc lộc, bình an mãi mãi!`,
                `Gửi bạn, <br><br>Mình chúc bạn năm mới phát triển toàn diện, luôn vui vẻ!`,
                `Bạn thân của mình, <br><br>Mình chúc bạn năm mới an vui, gặp nhiều cơ hội tốt đẹp!`,
                `Gửi bạn, <br><br>Tết này mình chúc bạn trăm điều tốt lành, tình bạn mãi bền lâu!`
            ],
            closing: "Thân mến"
        },

        "ban-nu": {
            greeting: "Gửi bạn,",
            recipient: "Gửi bạn",
            content: [
                `Gửi bạn thân yêu, <br><br>Xuân sang hoa nở khắp nơi, mình chúc bạn luôn xinh đẹp, tràn đầy niềm vui và may mắn. Bạn là người bạn tuyệt vời nhất. Cảm ơn bạn đã luôn lắng nghe, chia sẻ. Chúc bạn năm mới thật nhiều hạnh phúc, thành công rực rỡ!`,
                `Gửi bạn, <br><br>Tết đến rồi! Mình chúc bạn năm mới an khang, vạn sự như ý. Tình bạn của chúng mình là điều quý giá nhất. Mong bạn luôn vui vẻ, gặp nhiều điều tốt lành!`,
                `Bạn gái thân, <br><br>Năm mới 2026, mình chúc bạn khỏe mạnh, xinh đẹp, sự nghiệp thăng hoa!`,
                `Gửi bạn, <br><br>Mình chúc bạn năm mới phát tài phát lộc, hạnh phúc viên mãn!`,
                `Bạn yêu quý, <br><br>Tết này mình chúc bạn trăm điều may mắn, luôn tươi cười!`,
                `Gửi bạn thân, <br><br>Mình chúc bạn năm mới an vui, thành công, tình bạn mãi bền chặt!`,
                `Bạn gái yêu, <br><br>Mình chúc bạn năm mới vạn phúc lộc, sống vui vẻ!`,
                `Gửi bạn, <br><br>Tết này mình chúc bạn khỏe mạnh, xinh đẹp, gặp nhiều điều tốt đẹp!`,
                `Bạn thân của mình, <br><br>Mình chúc bạn năm mới trăm điều tốt lành, hạnh phúc tràn đầy!`,
                `Gửi bạn, <br><br>Mình chúc bạn năm mới phát triển toàn diện, luôn rạng rỡ!`
            ],
            closing: "Thân mến"
        },

        "ban-be": {
            greeting: "Gửi các bạn,",
            recipient: "Gửi các bạn",
            content: [
                `Gửi hội bạn thân, <br><br>Xuân về đầy ắp niềm vui, mình chúc tất cả năm mới sức khỏe, thành công, gặp nhiều may mắn. Những kỷ niệm bên nhau là kho báu của chúng mình. Cảm ơn các bạn đã luôn ở bên, chia sẻ mọi lúc. Chúc chúng mình luôn là bạn tốt, cùng nhau vượt qua mọi thử thách!`,
                `Gửi các bạn, <br><br>Tết đến xuân sang, mình chúc tất cả vạn sự như ý, hạnh phúc viên mãn. Tình bạn của chúng mình là điều quý giá. Mong chúng mình luôn vui vẻ, cùng nhau tạo thêm nhiều kỷ niệm đẹp!`,
                `Hội bạn yêu quý, <br><br>Năm mới 2026, mình chúc mọi người phát tài phát lộc, khỏe mạnh, thành công rực rỡ!`,
                `Gửi các bạn, <br><br>Mình chúc năm mới an khang, tình bạn mãi bền chặt!`,
                `Các bạn ơi, <br><br>Tết này mình chúc mọi người trăm điều tốt lành, vui vẻ bên gia đình!`,
                `Gửi hội bạn thân, <br><br>Mình chúc các bạn năm mới an vui, gặp nhiều cơ hội tốt đẹp!`,
                `Các bạn yêu quý, <br><br>Mình chúc năm mới vạn phúc lộc, sức khỏe dồi dào!`,
                `Gửi các bạn, <br><br>Tết này mình chúc mọi người thành công, hạnh phúc viên mãn!`,
                `Hội bạn của mình, <br><br>Mình chúc các bạn năm mới trăm điều may mắn, luôn vui vẻ!`,
                `Gửi các bạn thân, <br><br>Mình chúc năm mới phát triển toàn diện, tình bạn mãi bền lâu!`
            ],
            closing: "Thân mến"
        },

        "dong-nghiep-nam": {
            greeting: "Gửi đồng nghiệp,",
            recipient: "Gửi đồng nghiệp",
            content: [
                `Gửi anh bạn đồng nghiệp thân mến, <br><br>Xuân về với muôn vàn niềm vui, tôi xin chúc anh sức khỏe, công việc thăng tiến, gặp nhiều thành công. Được làm việc cùng anh là niềm vui lớn. Mong năm mới chúng ta sẽ tiếp tục hợp tác tốt đẹp, cùng nhau đạt được nhiều mục tiêu. Chúc anh gia đình hạnh phúc, phát tài phát lộc!`,
                `Gửi đồng nghiệp, <br><br>Tết đến xuân sang, tôi chúc anh năm mới vạn sự như ý, sự nghiệp thăng hoa. Anh là đồng nghiệp tuyệt vời. Chúc team luôn đoàn kết, thành công!`,
                `Gửi anh, <br><br>Năm mới 2026, chúc anh khỏe mạnh, công danh tiến xa!`,
                `Gửi đồng nghiệp thân, <br><br>Chúc anh năm mới an khang, phát tài phát lộc!`,
                `Gửi anh bạn, <br><br>Tết này chúc anh trăm điều may mắn, thành công rực rỡ!`,
                `Gửi anh đồng nghiệp, <br><br>Chúc anh năm mới mạnh khỏe, sự nghiệp thăng tiến!`,
                `Gửi đồng nghiệp yêu quý, <br><br>Tôi chúc anh năm mới vạn phúc lộc, bình an!`,
                `Gửi anh, <br><br>Chúc anh năm mới an vui, gia đình hạnh phúc!`,
                `Gửi đồng nghiệp thân mến, <br><br>Tôi chúc anh năm mới trăm điều tốt lành, thành công!`,
                `Gửi anh bạn đồng nghiệp, <br><br>Chúc anh năm mới phát triển toàn diện, khỏe mạnh!`
            ],
            closing: "Trân trọng"
        },

        "dong-nghiep-nu": {
            greeting: "Gửi đồng nghiệp,",
            recipient: "Gửi đồng nghiệp",
            content: [
                `Gửi chị bạn đồng nghiệp thân mến, <br><br>Xuân sang hoa nở khắp nơi, tôi xin chúc chị luôn xinh đẹp, sức khỏe, công việc thuận lợi. Được làm việc cùng chị là niềm vui. Mong năm mới chúng ta sẽ tiếp tục hợp tác hiệu quả, cùng nhau đạt được nhiều thành công. Chúc chị gia đình hạnh phúc, vạn sự như ý!`,
                `Gửi đồng nghiệp, <br><br>Tết đến rồi! Tôi chúc chị năm mới an khang, sự nghiệp thăng hoa. Chị là người đồng nghiệp tuyệt vời. Chúc team luôn thành công!`,
                `Gửi chị, <br><br>Năm mới 2026, chúc chị khỏe mạnh, xinh đẹp, thành công!`,
                `Gửi chị bạn, <br><br>Chúc chị năm mới phát tài phát lộc, hạnh phúc viên mãn!`,
                `Gửi đồng nghiệp thân, <br><br>Tết này chúc chị trăm điều tốt lành, vui vẻ!`,
                `Gửi chị đồng nghiệp, <br><br>Chúc chị năm mới mạnh khỏe, sự nghiệp thăng tiến!`,
                `Gửi chị yêu quý, <br><br>Tôi chúc chị năm mới vạn phúc lộc, bình an!`,
                `Gửi chị, <br><br>Chúc chị năm mới an vui, gia đình hạnh phúc!`,
                `Gửi đồng nghiệp thân mến, <br><br>Tôi chúc chị năm mới trăm điều tốt lành, xinh đẹp mãi!`,
                `Gửi chị bạn đồng nghiệp, <br><br>Chúc chị năm mới phát triển toàn diện, hạnh phúc!`
            ],
            closing: "Trân trọng"
        },

        "dong-nghiep": {
            greeting: "Gửi đồng nghiệp,",
            recipient: "Gửi đồng nghiệp",
            content: [
                `Gửi các đồng nghiệp thân mến, <br><br>Xuân về tươi đẹp, tôi xin chúc mọi người sức khỏe dồi dào, công việc thuận lợi, gia đình hạnh phúc. Được làm việc cùng nhau là niềm vui lớn. Mong năm mới chúng ta sẽ tiếp tục đoàn kết, hợp tác hiệu quả, cùng nhau đạt được nhiều thành tựu. Chúc team luôn thành công, phát triển!`,
                `Gửi các đồng nghiệp, <br><br>Tết đến xuân sang, tôi chúc mọi người năm mới vạn sự như ý, thăng tiến trong sự nghiệp. Chúng ta là một team tuyệt vời. Chúc tất cả luôn vui vẻ, thành công!`,
                `Gửi team, <br><br>Năm mới 2026, chúc mọi người phát tài phát lộc, khỏe mạnh!`,
                `Gửi các bạn đồng nghiệp, <br><br>Chúc năm mới an khang, đoàn kết, thành công!`,
                `Gửi mọi người, <br><br>Tết này chúc team trăm điều may mắn, hạnh phúc!`,
                `Gửi đồng nghiệp thân mến, <br><br>Chúc mọi người năm mới mạnh khỏe, sự nghiệp thăng hoa!`,
                `Gửi team yêu quý, <br><br>Tôi chúc mọi người năm mới vạn phúc lộc, bình an!`,
                `Gửi các đồng nghiệp, <br><br>Chúc năm mới an vui, gia đình sum vầy!`,
                `Gửi team, <br><br>Chúc mọi người năm mới trăm điều tốt lành, phát triển toàn diện!`,
                `Gửi đồng nghiệp, <br><br>Tôi chúc team năm mới thành công rực rỡ, đoàn kết mãi mãi!`
            ],
            closing: "Trân trọng"
        },

        "ban-trai": {
            greeting: "Gửi anh yêu,",
            recipient: "Gửi anh yêu",
            content: [
                `Gửi người yêu dấu, <br><br>Xuân về với muôn vàn niềm vui, em xin chúc anh sức khỏe, công việc thành công, luôn tràn đầy năng lượng. Anh là ánh sáng trong cuộc đời em. Cảm ơn anh đã luôn bên cạnh, yêu thương em. Năm mới này, em chúc chúng ta sẽ có thêm nhiều kỷ niệm đẹp, cùng nhau vượt qua mọi thử thách. Em yêu anh rất nhiều!`,
                `Gửi anh, <br><br>Tết đến rồi! Em chúc anh năm mới an khang, vạn sự như ý. Anh là tất cả của em. Mong chúng ta luôn bên nhau, yêu thương mãi mãi. Em yêu anh!`,
                `Anh yêu, <br><br>Năm mới 2026, em chúc anh khỏe mạnh, thành công, hạnh phúc. Em sẽ luôn ở bên anh!`,
                `Gửi anh yêu quý, <br><br>Em chúc anh năm mới phát tài phát lộc, sống vui, yêu em mãi nhé!`,
                `Anh của em, <br><br>Tết này em chúc anh trăm điều may mắn, chúng ta mãi bên nhau!`,
                `Gửi anh yêu dấu, <br><br>Em chúc anh năm mới mạnh khỏe, sự nghiệp thăng hoa, tình yêu chúng ta mãi bền chặt!`,
                `Anh thân yêu, <br><br>Em chúc anh năm mới an vui, bình an, hạnh phúc viên mãn!`,
                `Gửi anh, <br><br>Tết này em chúc anh vạn phúc lộc, khỏe mạnh, yêu em mãi mãi!`,
                `Anh yêu quý, <br><br>Em chúc anh năm mới trăm điều tốt lành, chúng ta luôn hạnh phúc!`,
                `Gửi người yêu dấu, <br><br>Em chúc anh năm mới phát triển toàn diện, tình yêu chúng ta mãi nồng nàn!`
            ],
            closing: "Yêu anh"
        },

        "ban-gai": {
            greeting: "Gửi em yêu,",
            recipient: "Gửi em yêu",
            content: [
                `Gửi người yêu dấu, <br><br>Xuân sang hoa nở rực rỡ, anh xin chúc em luôn xinh đẹp, tươi tắn, tràn đầy niềm vui. Em là ánh sáng trong cuộc đời anh. Cảm ơn em đã luôn ở bên, yêu thương anh. Năm mới này, anh chúc chúng ta sẽ có thêm nhiều kỷ niệm ngọt ngào, cùng nhau vượt qua mọi khó khăn. Anh yêu em rất nhiều!`,
                `Gửi em, <br><br>Tết đến xuân về, anh chúc em năm mới an khang, xinh đẹp. Em là tất cả của anh. Mong chúng ta luôn bên nhau, hạnh phúc mãi mãi. Anh yêu em!`,
                `Em yêu, <br><br>Năm mới 2026, anh chúc em khỏe mạnh, thành công, luôn vui vẻ. Anh sẽ mãi yêu em!`,
                `Gửi em yêu quý, <br><br>Anh chúc em năm mới phát tài phát lộc, hạnh phúc viên mãn!`,
                `Em gái của anh, <br><br>Tết này anh chúc em trăm điều tốt lành, chúng ta mãi bên nhau!`,
                `Gửi em yêu dấu, <br><br>Anh chúc em năm mới mạnh khỏe, xinh đẹp, sự nghiệp thăng hoa!`,
                `Em thân yêu, <br><br>Anh chúc em năm mới an vui, bình an, tình yêu chúng ta mãi bền chặt!`,
                `Gửi em, <br><br>Tết này anh chúc em vạn phúc lộc, khỏe mạnh, yêu anh mãi mãi!`,
                `Em yêu quý, <br><br>Anh chúc em năm mới trăm điều may mắn, luôn tươi cười!`,
                `Gửi người yêu dấu, <br><br>Anh chúc em năm mới phát triển toàn diện, hạnh phúc tràn đầy!`
            ],
            closing: "Yêu em"
        },

        "vo-chong": {
            greeting: "Gửi vợ yêu / Gửi chồng yêu,",
            recipient: "Gửi vợ/chồng yêu",
            content: [
                `Gửi người bạn đời thân yêu, <br><br>Xuân về với muôn vàn niềm vui, anh/em xin chúc em/anh sức khỏe, hạnh phúc, gia đình luôn ấm no. Em/anh là tất cả của anh/em, là nửa còn lại của cuộc đời. Cảm ơn em/anh đã luôn ở bên, cùng anh/em vượt qua mọi thăng trầm. Năm mới này, chúc chúng ta luôn yêu thương, gia đình sum vầy, hạnh phúc!`,
                `Gửi người yêu thương nhất, <br><br>Tết đến rồi! Anh/em chúc em/anh năm mới vạn sự như ý, gia đình luôn hạnh phúc. Em/anh là món quà quý giá nhất. Mong chúng ta luôn bên nhau, yêu thương mãi mãi!`,
                `Vợ/Chồng yêu, <br><br>Năm mới 2026, anh/em chúc em/anh khỏe mạnh, hạnh phúc, chúng ta mãi bên nhau!`,
                `Gửi người ấy, <br><br>Anh/em chúc em/anh năm mới phát tài phát lộc, gia đình viên mãn!`,
                `Người yêu dấu, <br><br>Tết này anh/em chúc em/anh trăm điều may mắn, tình yêu chúng ta mãi bền chặt!`,
                `Gửi vợ/chồng yêu quý, <br><br>Anh/em chúc em/anh năm mới an khang, sống vui, yêu nhau mãi mãi!`,
                `Người bạn đời, <br><br>Anh/em chúc em/anh năm mới mạnh khỏe, thành công, gia đình ấm no!`,
                `Gửi người yêu thương, <br><br>Tết này anh/em chúc em/anh vạn phúc lộc, bình an, hạnh phúc viên mãn!`,
                `Vợ/Chồng thân yêu, <br><br>Anh/em chúc em/anh năm mới trăm điều tốt lành, chúng ta luôn hạnh phúc!`,
                `Gửi người ấy, <br><br>Anh/em chúc em/anh năm mới phát triển toàn diện, tình yêu mãi nồng nàn!`
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