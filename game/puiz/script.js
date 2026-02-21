// ============================================================
//  quiz-engine.js — クイズ動作エンジン
//  quiz.html で読み込まれます
// ============================================================

const QuizEngine = (() => {
  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  let activeQuiz = null;
  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let totalScore = 0;
  let answers = [];
  let answered = false;

  // ═══════════════════════════════════════════════════════════
  //  Public API
  // ═══════════════════════════════════════════════════════════
  
  function init() {
    if (typeof quizzes === 'undefined' || !Array.isArray(quizzes)) {
      console.error('quiz-data.js が読み込めませんでした');
      return false;
    }
    return true;
  }

  function getQuizzes() {
    return quizzes || [];
  }

  function startQuiz(quizIndex) {
    activeQuiz = quizzes[quizIndex];
    questions = activeQuiz.questions || [];
    totalScore = questions.reduce((s, q) => s + (q.score || 10), 0);
    currentIndex = 0;
    score = 0;
    answers = [];
    answered = false;
    return {
      quiz: activeQuiz,
      totalQuestions: questions.length,
      totalScore
    };
  }

  function getCurrentQuestion() {
    if (currentIndex >= questions.length) return null;
    return questions[currentIndex];
  }

  function getCurrentIndex() {
    return currentIndex;
  }

  function getScore() {
    return score;
  }

  function getTotalScore() {
    return totalScore;
  }

  function isAnswered() {
    return answered;
  }

  function submitAnswer(userAnswer) {
    if (answered) return null;
    answered = true;

    const q = questions[currentIndex];
    let isCorrect = false;
    let correctAnswer = null;

    // 問題タイプ別の正誤判定
    if (q.type === 'single') {
      isCorrect = userAnswer === q.answer;
      correctAnswer = q.choices[q.answer];
    } else if (q.type === 'multiple') {
      // 配列の比較（順序関係なく同じ要素を含むか）
      const userSet = new Set(userAnswer);
      const correctSet = new Set(q.answer);
      isCorrect = userSet.size === correctSet.size && 
                  [...userSet].every(x => correctSet.has(x));
      correctAnswer = q.answer.map(i => q.choices[i]).join(', ');
    } else if (q.type === 'input') {
      // テキスト入力の判定
      const userText = q.caseSensitive ? userAnswer : userAnswer.toLowerCase();
      const correctAnswers = q.caseSensitive 
        ? q.answer 
        : q.answer.map(a => a.toLowerCase());
      isCorrect = correctAnswers.some(ans => {
        // 完全一致または前後の空白を無視して一致
        return userText.trim() === ans.trim();
      });
      correctAnswer = q.answer[0]; // 最初の正解例を表示
    }

    const earned = isCorrect ? (q.score || 10) : 0;
    if (isCorrect) score += earned;

    const result = {
      correct: isCorrect,
      earned,
      max: q.score || 10,
      question: q.question,
      correctAnswer,
      explanation: q.explanation || '',
      userAnswer: formatUserAnswer(q, userAnswer)
    };

    answers.push(result);
    return result;
  }

  function nextQuestion() {
    currentIndex++;
    answered = false;
    return currentIndex < questions.length;
  }

  function getResults() {
    const correct = answers.filter(a => a.correct).length;
    const wrong = answers.length - correct;
    const rate = Math.round(correct / answers.length * 100);
    const pct = totalScore > 0 ? score / totalScore * 100 : 0;

    let rank, emoji, comment;
    if (pct >= 90) { rank = 'S'; emoji = '🏆'; comment = '完璧！さすがです！'; }
    else if (pct >= 75) { rank = 'A'; emoji = '🎉'; comment = '素晴らしい！高得点！'; }
    else if (pct >= 60) { rank = 'B'; emoji = '😊'; comment = 'よくできました！'; }
    else if (pct >= 40) { rank = 'C'; emoji = '🤔'; comment = '復習して再挑戦！'; }
    else { rank = 'D'; emoji = '😅'; comment = '基礎から復習しましょう！'; }

    return {
      score,
      totalScore,
      correct,
      wrong,
      total: answers.length,
      rate,
      rank,
      emoji,
      comment,
      answers,
      quiz: activeQuiz
    };
  }

  function getActiveQuiz() {
    return activeQuiz;
  }

  // ═══════════════════════════════════════════════════════════
  //  Helpers
  // ═══════════════════════════════════════════════════════════
  
  function formatUserAnswer(question, userAnswer) {
    if (question.type === 'single') {
      return question.choices[userAnswer];
    } else if (question.type === 'multiple') {
      return userAnswer.map(i => question.choices[i]).join(', ');
    } else if (question.type === 'input') {
      return userAnswer;
    }
    return '';
  }

  function getChoiceLetters() {
    return LETTERS;
  }

  return {
    init,
    getQuizzes,
    startQuiz,
    getCurrentQuestion,
    getCurrentIndex,
    getScore,
    getTotalScore,
    isAnswered,
    submitAnswer,
    nextQuestion,
    getResults,
    getActiveQuiz,
    getChoiceLetters
  };
})();
