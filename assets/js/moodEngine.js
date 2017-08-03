var app = angular.module('ImproveYourMood', ['ngclipboard']);

app.controller('moodEngine', ['$scope', function($scope) {

  $scope.Math = window.Math;

  $scope.date = new Date();

  $scope.quotes = [];
  $scope.quotes[0] = 'Your smile is contagious.';
  $scope.quotes[1] = 'You look great today.';
  $scope.quotes[2] = 'You\'re a smart cookie.';
  $scope.quotes[3] = 'I bet you make babies smile.';
  $scope.quotes[4] = 'You have impeccable manners.';
  $scope.quotes[5] = 'I like your style.';
  $scope.quotes[6] = 'You have the best laugh.';
  $scope.quotes[7] = 'I appreciate you.';
  $scope.quotes[8] = 'You are the most perfect you there is.';
  $scope.quotes[9] = 'You light up the room.';
  $scope.quotes[10] = 'You should be proud of yourself.';
  $scope.quotes[11] = 'You have a great sense of humor.';
  $scope.quotes[12] = 'Is that your picture next to \'charming\' in the dictionary?';
  $scope.quotes[13] = 'On a scale from 1 to 10, you\'re an 11.';
  $scope.quotes[14] = 'You are brave.';
  $scope.quotes[15] = 'You\'re even more beautiful on the inside than you are on the outside.';
  $scope.quotes[16] = 'If cartoon bluebirds were real, a bunch of them would be sitting on your shoulders singing right now.';
  $scope.quotes[17] = 'You are making a difference.';
  $scope.quotes[18] = 'You\'re like sunshine on a rainy day.';
  $scope.quotes[19] = 'You bring out the best in other people.';
  $scope.quotes[20] = 'You\'re a great listener.';
  $scope.quotes[21] = 'Everything would be better if more people were like you!';
  $scope.quotes[22] = 'Hanging out with you is always a blast.';
  $scope.quotes[23] = 'Being around you makes everything better!';
  $scope.quotes[24] = 'When you say, \'I meant to do that,\' I totally believe you.';
  $scope.quotes[25] = 'Colours seem brighter when you\'re around.';
  $scope.quotes[26] = 'You\'re wonderful.';
  $scope.quotes[27] = 'Jokes are funnier when you tell them.';
  $scope.quotes[28] = 'You\'re one of a kind!';
  $scope.quotes[29] = 'You\'re inspiring.';
  $scope.quotes[30] = 'You should be thanked more often. So thank you!!';
  $scope.quotes[31] = 'Our community is better because you\'re in it.';
  $scope.quotes[32] = 'You have the best ideas.';
  $scope.quotes[33] = 'You always know how to find that silver lining.';
  $scope.quotes[34] = 'Everyone gets knocked down sometimes, but you always get back up and keep going.';
  $scope.quotes[35] = 'You\'re a candle in the darkness.';
  $scope.quotes[36] = 'You\'re a great example to others.';
  $scope.quotes[37] = 'Being around you is like being on a happy little vacation.';
  $scope.quotes[38] = 'You always know just what to say.';
  $scope.quotes[39] = 'If someone based an Internet meme on you, it would have impeccable grammar.';
  $scope.quotes[40] = 'The people you love are lucky to have you in their lives.';
  $scope.quotes[41] = 'You\'re like a breath of fresh air.';
  $scope.quotes[42] = 'You\'re so thoughtful.';
  $scope.quotes[43] = 'Your creative potential seems limitless.';
  $scope.quotes[44] = 'Actions speak louder than words, and yours tell an incredible story.';
  $scope.quotes[45] = 'You\'re someone\'s reason to smile.';
  $scope.quotes[46] = 'You\'re even better than a unicorn, because you\'re real.';
  $scope.quotes[47] = 'You\'re really something special.';
  $scope.quotes[48] = 'You\'re a gift to those around you.';

  $scope.colours = new Array('#FFB6C1', '#DC143C', '#DB7093', '#FF69B4', '#FF1493', '#C71585', '#DA70D6', '#DDA0DD', '#EE82EE', '#8B008B', '#800080', '#BA55D3', '#9400D3', '#9932CC', '#4B0082', '#8A2BE2', '#9370DB', '#7B68EE', '#6A5ACD', '#483D8B', '#0000FF', '#0000CD', '#00008B', '#000080', '#191970', '#4169E1', '#6495ED', '#778899', '#708090', '#1E90FF', '#4682B4', '#87CEFA', '#87CEEB', '#00BFFF', '#5F9EA0', '#00CED1', '#008B8B', '#008080', '#2F4F4F', '#48D1CC', '#20B2AA', '#40E0D0', '#66CDAA', '#00FF7F', '#3CB371', '#2E8B57', '#8FBC8F', '#32CD32', '#00FF00', '#228B22', '#008000', '#006400', '#7CFC00', '#7FFF00', '#556B2F', '#9ACD32', '#6B8E23', '#808000', '#BDB76B', '#FFD700', '#DAA520', '#B8860B', '#D2B48C', '#DEB887', '#FF8C00', '#CD853F', '#F4A460', '#D2691E', '#8B4513', '#A0522D', '#E9967A', '#FF6347', '#FA8072', '#F08080', '#BC8F8F', '#CD5C5C', '#FF0000', '#A52A2A', '#B22222', '#8B0000', '#800000');

  $scope.reloadEngine = function() {

    $scope.randomQuoteNumber = Math.floor(Math.random() * $scope.quotes.length);
    $scope.randomQuote = $scope.quotes[$scope.randomQuoteNumber];
    $scope.randomColourNumber = Math.floor(Math.random() * $scope.colours.length);
    $scope.randomColour = $scope.colours[$scope.randomColourNumber];

  }

  $scope.reloadEngine();

}]);
