document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const relationshipSelection = document.getElementById("relationship-selection");
  const relationshipGrid = relationshipSelection.querySelector(".grid");
  const ageSelection = document.getElementById("age-selection");
  const ageGrid = ageSelection.querySelector(".grid");
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
  const letterGreeting = document.getElementById("letter-greeting");
  const letterContent = document.getElementById("letter-content");
  const letterClosing = document.getElementById("letter-closing");
  let scratchCanvas = null;
  const moneyAmount = document.getElementById("money-amount");
  const closeModalBtn = document.getElementById("close-modal");
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
  let scratchPoints = [];

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

  // Letter Templates (keeping from original - too long to include here, use original)
  const letterTemplates = {
    grandparents: [
      `Xuân mới lại về, mang theo bao niềm vui và hy vọng. Nhân dịp năm mới, cháu xin gửi đến Ông Bà lời chúc sức khỏe, an khang và thịnh vượng.<br><br>Chúc Ông Bà luôn dồi dào sức khỏe, tinh thần minh mẫn, và tràn đầy niềm vui trong cuộc sống. Mong rằng năm mới sẽ mang đến nhiều may mắn, thành công và hạnh phúc cho Ông Bà.<br><br>Dù không gian có cách trở nhưng tấm lòng và tình cảm luôn hướng về Ông Bà.`,
      `Kính gửi Ông Bà,<br><br>Xuân về mang theo niềm vui mới, cháu xin gửi lời chúc đến Ông Bà. Chúc Ông Bà năm mới sức khỏe dồi dào, tuổi thọ như đá Sơn Tinh, phúc như Đông Hải.<br><br>Mong Ông Bà luôn vui vẻ, an lạc bên con cháu. Cháu biết rằng sự bình an của Ông Bà chính là hạnh phúc lớn nhất của gia đình.<br><br>Kính chúc Ông Bà một năm thật nhiều niềm vui!`,
      `Thưa Ông Bà,<br><br>Tết đến xuân về, cháu xin kính chúc Ông Bà vạn sự như ý. Mong Ông Bà luôn mạnh khỏe, sống lâu trăm tuổi để chứng kiến con cháu khôn lớn.<br><br>Những lời dạy của Ông Bà là hành trang quý báu nhất cho cuộc đời cháu. Cháu sẽ cố gắng học tập, rèn luyện để không phụ lòng Ông Bà.<br><br>Năm mới này, cháu chúc gia đình luôn sum vầy, ấm áp!`,
      `Kính thưa Ông Bà,<br><br>Năm mới xuân sang, cháu kính chúc Ông Bà sức khỏe dồi dào, tâm thần an lạc. Ông Bà là cội nguồn của gia đình, là chỗ dựa vững chắc cho con cháu.<br><br>Cháu mong Ông Bà luôn được bình an, hạnh phúc, để cháu có cơ hội được chăm sóc và báo hiếu. Mỗi kỷ niệm bên Ông Bà đều là món quà quý giá.<br><br>Chúc Ông Bà năm mới tràn đầy phúc lộc!`,
      `Kính gửi Ông Bà yêu quý,<br><br>Xuân về đất trời đổi mới, cháu xin gửi đến Ông Bà lời chúc ân cần. Chúc Ông Bà luôn khỏe mạnh, vui tươi, được sum họp cùng con cháu.<br><br>Những câu chuyện Ông Bà kể, những lời khuyên Ông Bà dạy, cháu sẽ luôn ghi nhớ. Đó là kho báu vô giá mà cháu trân quý suốt đời.<br><br>Cháu yêu Ông Bà rất nhiều!`
    ],
    parents: [
      `Gửi Bố Mẹ yêu quý,<br><br>Xuân mới lại về, con xin gửi đến Bố Mẹ những lời chúc tốt đẹp nhất. Chúc Bố Mẹ năm mới thật nhiều sức khỏe, luôn vui vẻ và hạnh phúc.<br><br>Cảm ơn Bố Mẹ đã luôn yêu thương, chăm sóc và dạy dỗ con nên người. Mỗi dịp Tết đến, con lại nhớ về những kỷ niệm đẹp bên gia đình.<br><br>Con hứa sẽ cố gắng học tập và làm việc thật tốt để không phụ lòng Bố Mẹ.`,
      `Kính gửi Bố Mẹ,<br><br>Năm mới đến, con xin chúc Bố Mẹ sức khỏe dồi dào, công việc thuận lợi, tài lộc đầy nhà. Bố Mẹ là điểm tựa vững chắc nhất của con.<br><br>Con biết Bố Mẹ đã vất vả nuôi con khôn lớn. Mỗi sợi tóc bạc của Bố Mẹ là tình yêu thương dành cho con. Con sẽ cố gắng để Bố Mẹ tự hào.<br><br>Chúc Bố Mẹ năm mới an khang, hạnh phúc bên con cháu!`,
      `Thưa Bố Mẹ,<br><br>Tết đến xuân về, con xin kính chúc Bố Mẹ một năm mới tràn đầy may mắn. Mong Bố Mẹ luôn khỏe mạnh, vui vẻ để đồng hành cùng con trên mọi nẻo đường.<br><br>Những bài học Bố Mẹ dạy, con sẽ nhớ mãi. Con hứa sẽ sống tốt, làm việc chăm chỉ để xứng đáng với tình yêu thương của Bố Mẹ.<br><br>Con yêu Bố Mẹ rất nhiều!`,
      `Gửi Bố Mẹ thân yêu,<br><br>Năm mới về với niềm vui mới, con chúc Bố Mẹ luôn vui khỏe, hạnh phúc. Công ơn Bố Mẹ như núi cao biển rộng, con không thể nào đo đếm được.<br><br>Con biết ơn từng bữa cơm Mẹ nấu, từng lần Bố đưa đón. Đó là tình yêu thương vô điều kiện mà con may mắn được nhận.<br><br>Con hứa sẽ cố gắng làm Bố Mẹ vui lòng!`,
      `Kính gửi Bố Mẹ,<br><br>Xuân sang, con xin chúc Bố Mẹ năm mới bình an, sức khỏe. Mỗi năm trôi qua, con càng thấy may mắn vì có Bố Mẹ bên cạnh.<br><br>Dù con có đi xa hay ở gần, trái tim con luôn hướng về Bố Mẹ. Con mong được ở bên, chăm sóc Bố Mẹ khi Bố Mẹ già.<br><br>Chúc Bố Mẹ năm mới thật nhiều niềm vui!`
    ],
    children: [
      `Gửi các con yêu quý,<br><br>Năm mới đến, ba/mẹ gửi đến các con lời chúc tốt đẹp nhất. Chúc các con luôn khỏe mạnh, vui vẻ và học hành chăm ngoan.<br><br>Ba/mẹ rất tự hào về các con, những đứa trẻ ngoan ngoãn và hiếu thảo. Mong rằng năm mới sẽ mang đến cho các con thật nhiều niềm vui và kỷ niệm đẹp.<br><br>Hãy luôn giữ cho mình trái tim ấm áp và tinh thần lạc quan.`,
      `Gửi con yêu,<br><br>Xuân mới đến, ba/mẹ chúc con một năm đầy sức khỏe, học giỏi, ngoan ngoãn. Con là niềm tự hào lớn nhất của ba/mẹ.<br><br>Ba/mẹ mong con luôn vui vẻ, tự tin và dũng cảm theo đuổi ước mơ. Dù con có đi xa đến đâu, trái tim ba/mẹ luôn ở bên con.<br><br>Chúc con năm mới thành công rực rỡ!`,
      `Thương gửi các con,<br><br>Tết đến, ba/mẹ chúc các con sức khỏe, hạnh phúc và thật nhiều điều tốt lành. Các con là món quà quý giá nhất cuộc đời ba/mẹ.<br><br>Mong các con luôn giữ được sự trong sáng, lạc quan và yêu thương người khác. Ba/mẹ tin các con sẽ trưởng thành tốt đẹp.<br><br>Ba/mẹ yêu các con vô cùng!`,
      `Gửi con thân yêu,<br><br>Năm mới, ba/mẹ chúc con luôn mạnh khỏe, vui tươi, học tập tốt. Con là ánh sáng trong cuộc đời ba/mẹ, là lý do ba/mẹ cố gắng mỗi ngày.<br><br>Hãy luôn tự tin vào bản thân, con có thể làm được mọi điều con muốn. Ba/mẹ sẽ luôn ở đây, ủng hộ con.<br><br>Chúc con năm mới ngập tràn niềm vui!`,
      `Gửi các con yêu,<br><br>Tết đến xuân về, ba/mẹ chúc các con năm mới an lành, học hành tiến bộ. Các con lớn lên từng ngày, khiến ba/mẹ vừa vui vừa xúc động.<br><br>Mong các con luôn giữ được tính hiếu thảo, biết yêu thương gia đình và quan tâm đến người khác. Đó là điều ba/mẹ trân quý nhất.<br><br>Yêu các con nhiều lắm!`
    ],
    siblings: [
      `Gửi anh/chị/em thân yêu,<br><br>Xuân về với muôn vàn niềm vui, anh/chị/em gửi lời chúc năm mới an khang, thịnh vượng. Chúc mình luôn khỏe mạnh, thành công trong công việc.<br><br>Những kỷ niệm tuổi thơ bên nhau là kho báu quý giá. Dù cuộc sống có bận rộn, tình anh em mãi trong tim.<br><br>Chúc năm mới này đem đến nhiều điều tốt đẹp cho gia đình mình!`,
      `Thân gửi anh/chị/em,<br><br>Năm mới đến, em/anh/chị chúc gia đình luôn vui vẻ, hạnh phúc. Chúng ta đã cùng nhau lớn lên, chia sẻ bao kỷ niệm đẹp.<br><br>Mong rằng năm mới, mọi điều may mắn sẽ đến với gia đình. Chúng ta hãy luôn bên nhau, hỗ trợ nhau trên mọi con đường.<br><br>Thân ái và chúc mừng năm mới!`,
      `Kính chào anh/chị/em,<br><br>Tết đến xuân về, em/anh/chị xin chúc một năm mới tràn đầy niềm vui. Tình anh em là sợi dây gắn kết bền chặt nhất.<br><br>Mong anh/chị/em luôn mạnh khỏe, công việc thuận lợi, gia đình ấm êm. Hãy luôn giữ liên lạc và chia sẻ với nhau.<br><br>Chúc mừng năm mới!`,
      `Gửi anh/chị/em yêu quý,<br><br>Xuân mới, em/anh/chị chúc năm mới hạnh phúc, thành đạt. Dù xa hay gần, tình anh em luôn kết nối chúng ta.<br><br>Cảm ơn vì đã luôn ở đây khi em/anh/chị cần. Mong mối quan hệ của chúng ta sẽ mãi bền chặt như thế.<br><br>Chúc năm mới nhiều niềm vui!`,
      `Thân gửi anh/chị/em,<br><br>Năm mới đến rồi, chúc anh/chị/em sức khỏe, tài lộc. Những lúc vui buồn, chúng ta luôn có nhau.<br><br>Em/anh/chị biết ơn vì có anh/chị/em trong cuộc đời. Hãy cùng nhau tạo nên nhiều kỷ niệm đẹp hơn nữa.<br><br>Chúc mừng năm mới gia đình!`
    ],
    friends: [
      `Gửi bạn thân yêu,<br><br>Năm mới đến rồi! Chúc bạn một năm tràn đầy sức khỏe, thành công và hạnh phúc. Tình bạn của chúng ta là món quà quý giá mà mình trân trọng.<br><br>Cảm ơn bạn đã luôn bên cạnh, chia sẻ trong những lúc vui buồn. Mong năm mới sẽ có thêm nhiều kỷ niệm đẹp cho đôi ta.<br><br>Chúc bạn luôn vui vẻ và may mắn!`,
      `Thân gửi bạn,<br><br>Xuân về với bao niềm vui mới, mình chúc bạn năm mới an khang, thịnh vượng. Những chuyến đi, những cuộc trò chuyện của chúng ta là kỷ niệm không thể quên.<br><br>Mong bạn luôn giữ được tinh thần lạc quan, tự tin chinh phục mọi mục tiêu. Tình bạn đẹp là điều mình luôn trân quý.<br><br>Chúc mừng năm mới bạn nhé!`,
      `Kính gửi người bạn,<br><br>Tết đến, mình xin chúc bạn sức khỏe dồi dào, công việc thuận lợi, tình duyên viên mãn. Có bạn bên cạnh, cuộc sống thêm ý nghĩa.<br><br>Dù xa hay gần, tình bạn của chúng ta vẫn luôn bền chặt. Chúc bạn năm mới đạt được mọi ước mơ!<br><br>Thân ái!`,
      `Gửi người bạn thân thiết,<br><br>Năm mới, chúc bạn luôn vui vẻ, khỏe mạnh, gặp nhiều may mắn. Mình biết ơn vì có bạn trong cuộc đời.<br><br>Những kỷ niệm chúng ta tạo ra là kho báu vô giá. Hãy cùng nhau viết tiếp câu chuyện đẹp trong năm mới này.<br><br>Chúc bạn năm mới rực rỡ!`,
      `Thân gửi bạn hiền,<br><br>Xuân sang, chúc bạn năm mới phúc lộc đầy nhà, sự nghiệp thăng tiến. Tình bạn chân thành như chúng ta rất hiếm có.<br><br>Cảm ơn bạn đã luôn lắng nghe, chia sẻ và động viên. Mong năm mới mang đến cho bạn tất cả điều tốt đẹp nhất.<br><br>Thân mến!`
    ],
    colleagues: [
      `Gửi đồng nghiệp thân mến,<br><br>Nhân dịp năm mới, xin chúc anh/chị/bạn sức khỏe dồi dào, công việc thăng tiến, gia đình hạnh phúc. Được làm việc cùng là niềm vui lớn.<br><br>Mong rằng năm mới, chúng ta sẽ tiếp tục hợp tác tốt đẹp, cùng nhau đạt được nhiều thành công. Chúc cả team luôn đoàn kết!<br><br>Chúc mừng năm mới!`,
      `Kính gửi đồng nghiệp,<br><br>Xuân về với niềm vui mới, tôi xin chúc anh/chị một năm mới thật nhiều may mắn. Sự hỗ trợ của anh/chị luôn là động lực lớn.<br><br>Chúc công việc thuận lợi, sự nghiệp thăng tiến, gia đình ấm no. Hy vọng chúng ta sẽ có nhiều dự án thành công trong năm mới.<br><br>Trân trọng!`,
      `Thân gửi anh/chị đồng nghiệp,<br><br>Năm mới đến, chúc anh/chị sức khỏe, thành đạt, hạnh phúc bên gia đình. Làm việc cùng anh/chị là trải nghiệm tuyệt vời.<br><br>Mong năm mới đem lại nhiều cơ hội mới, thành công rực rỡ cho cả team. Chúng ta cùng nhau tiến bước!<br><br>Chúc mừng năm mới!`,
      `Gửi đồng nghiệp,<br><br>Tết đến, chúc anh/chị năm mới an khang, phát tài phát lộc. Sự chuyên nghiệp và tận tâm của anh/chị là tấm gương để học tập.<br><br>Chúc cho những nỗ lực của chúng ta sẽ được đền đáp xứng đáng. Năm mới, chúng ta cùng tiến xa hơn nữa!<br><br>Trân trọng!`,
      `Kính gửi đồng nghiệp thân thiết,<br><br>Xuân mới, chúc anh/chị sức khỏe, công danh. Làm việc chung với anh/chị giúp tôi học được nhiều điều.<br><br>Mong năm mới mang đến nhiều thành tích mới, cơ hội mới. Chúc cả công ty luôn phát triển vững mạnh!<br><br>Chúc mừng năm mới!`
    ],
    lovers: [
      `Gửi người yêu dấu,<br><br>Xuân về, anh/em xin gửi đến em/anh lời chúc ngọt ngào nhất. Chúc chúng ta một năm mới tràn đầy hạnh phúc, tình yêu thắm thiết.<br><br>Em/anh là ánh sáng trong cuộc đời anh/em. Mong rằng năm mới, chúng ta sẽ có thêm nhiều kỷ niệm đẹp, cùng nhau vượt qua mọi thử thách.<br><br>Anh/em yêu em/anh rất nhiều!`,
      `Thương gửi người yêu,<br><br>Năm mới đến, anh/em chúc em/anh luôn xinh đẹp/đẹp trai, tươi cười, và hạnh phúc bên anh/em. Tình yêu của chúng ta là điều quý giá nhất.<br><br>Cảm ơn em/anh đã đến bên anh/em, làm cuộc sống thêm ý nghĩa. Anh/em hứa sẽ luôn yêu thương, chăm sóc em/anh.<br><br>Yêu em/anh nhiều lắm!`,
      `Kính gửi tình yêu của đời anh/em,<br><br>Tết đến xuân về, anh/em xin chúc em/anh một năm mới thật nhiều niềm vui. Được ở bên em/anh là hạnh phúc lớn nhất của anh/em.<br><br>Mong chúng ta sẽ mãi bên nhau, cùng nhau xây dựng tương lai tươi sáng. Năm mới này, anh/em chỉ mong em/anh luôn vui vẻ!<br><br>Mãi yêu em/anh!`,
      `Gửi nửa kia của anh/em,<br><br>Xuân sang, anh/em chúc em/anh năm mới tràn đầy yêu thương, hạnh phúc. Em/anh làm cuộc đời anh/em thêm ý nghĩa biết bao.<br><br>Cảm ơn em/anh vì đã chọn anh/em. Anh/em hứa sẽ luôn cố gắng để xứng đáng với tình yêu của em/anh.<br><br>Yêu em/anh muôn đời!`,
      `Thương gửi em/anh yêu,<br><br>Năm mới, chúc em/anh luôn rạng rỡ, xinh đẹp/phong độ, và hạnh phúc. Mỗi ngày được thức dậy bên em/anh là món quà tuyệt vời nhất.<br><br>Anh/em mong năm mới sẽ có thêm nhiều khoảnh khắc ngọt ngào bên em/anh. Hãy cùng nhau tạo nên những kỷ niệm khó quên.<br><br>Yêu em/anh vô cùng!`
    ],
    aunt_uncle: [
      `Kính gửi Cô/Dì/Chú/Bác,<br><br>Xuân về, cháu xin kính chúc Cô/Dì/Chú/Bác sức khỏe dồi dào, gia đình hạnh phúc, công việc thuận lợi. Tình cảm của Cô/Dì/Chú/Bác dành cho cháu thật ấm áp.<br><br>Mong năm mới mang đến nhiều niềm vui, thành công cho gia đình Cô/Dì/Chú/Bác. Cháu luôn biết ơn sự quan tâm của Cô/Dì/Chú/Bác.<br><br>Kính chúc một năm mới an khang!`,
      `Thưa Cô/Dì/Chú/Bác,<br><br>Nhân dịp năm mới, cháu xin gửi lời chúc tốt đẹp nhất. Chúc Cô/Dì/Chú/Bác luôn mạnh khỏe, công việc phát đạt, con cháu ngoan ngoãn.<br><br>Những lời khuyên của Cô/Dì/Chú/Bác là kim chỉ nam cho cháu. Cháu sẽ cố gắng để không phụ lòng mong đợi của Cô/Dì/Chú/Bác.<br><br>Kính chúc năm mới vui vẻ!`,
      `Kính chào Cô/Dì/Chú/Bác,<br><br>Tết đến xuân về, cháu xin chúc gia đình Cô/Dì/Chú/Bác năm mới an khang, thịnh vượng. Tình thân trong gia đình là điều quý báu nhất.<br><br>Mong Cô/Dì/Chú/Bác luôn vui vẻ, hạnh phúc bên người thân. Cháu rất trân trọng tình cảm và sự quan tâm của Cô/Dì/Chú/Bác.<br><br>Kính chúc mừng năm mới!`,
      `Kính thưa Cô/Dì/Chú/Bác,<br><br>Xuân mới, cháu kính chúc Cô/Dì/Chú/Bác sức khỏe, phúc lộc. Cô/Dì/Chú/Bác như người thân thứ hai của cháu.<br><br>Cảm ơn Cô/Dì/Chú/Bác đã luôn quan tâm, động viên cháu. Những lời dạy của Cô/Dì/Chú/Bác, cháu sẽ ghi nhớ.<br><br>Chúc Cô/Dì/Chú/Bác năm mới vạn sự như ý!`,
      `Kính gửi Cô/Dì/Chú/Bác yêu quý,<br><br>Năm mới, cháu chúc Cô/Dì/Chú/Bác an khang, thịnh vượng, vui khỏe. Tình cảm gia đình là sợi dây kết nối chúng ta.<br><br>Mong Cô/Dì/Chú/Bác luôn được bình an, hạnh phúc. Cháu sẽ cố gắng học tập, làm việc tốt để Cô/Dì/Chú/Bác vui lòng.<br><br>Kính chúc năm mới tốt lành!`
    ]
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

        updateStepIndicator(2);
        scrollToAge.classList.remove("hidden");

        setTimeout(() => {
          initAgeSelection();
          ageSelection.classList.remove("hidden");
          ageSelection.scrollIntoView({ behavior: "smooth", block: "start" });

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

        updateStepIndicator(3);
        scrollToHongbao.classList.remove("hidden");

        setTimeout(() => {
          createHongbaos();
          hongbaoSelection.classList.remove("hidden");
          hongbaoSelection.scrollIntoView({ behavior: "smooth", block: "start" });

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
    diceSection.classList.remove("hidden");
    letterScratchSection.classList.add("hidden");

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
    dice1.classList.remove("rolling");
    dice2.classList.remove("rolling");
    dice3.classList.remove("rolling");

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

  // Initialize Scratch Card - PROPERLY FIXED
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

    // Create scratch surface with dotted pattern
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

    // Add subtle gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    // Add prominent text
    ctx.fillStyle = "#8B4513";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CÀO ĐỂ NHẬN LỘC", scratchCanvas.width / 2, scratchCanvas.height / 2);

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

  document.addEventListener('mousemove', function (e) {
    if (!isScratching || !scratchCanvas) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (scratchPoints.length > 0) {
      const lastPoint = scratchPoints[scratchPoints.length - 1];
      interpolatePoints(lastPoint.x, lastPoint.y, x, y);
    }

    scratchPoints.push({ x, y });
    scratch(x, y);
  });

  document.addEventListener('mouseup', function () {
    if (isScratching) {
      isScratching = false;
      scratchPoints = [];
    }
  });

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

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !resultModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  initRelationshipSelection();
});