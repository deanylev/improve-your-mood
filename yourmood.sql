-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 09, 2017 at 10:55 AM
-- Server version: 10.1.24-MariaDB
-- PHP Version: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yourmood`
--

-- --------------------------------------------------------

--
-- Table structure for table `colours`
--

CREATE TABLE `colours` (
  `id` int(11) NOT NULL,
  `colour` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `colours`
--

INSERT INTO `colours` (`id`, `colour`) VALUES
(23, 'DC143C'),
(24, 'DB7093'),
(25, 'FF69B4'),
(26, 'FF1493'),
(27, 'C71585'),
(28, 'DA70D6'),
(30, 'EE82EE'),
(31, '8B008B'),
(32, '800080'),
(33, 'BA55D3'),
(34, '9400D3'),
(35, '9932CC'),
(36, '4B0082'),
(37, '8A2BE2'),
(38, '9370DB'),
(39, '7B68EE'),
(40, '6A5ACD'),
(41, '483D8B'),
(42, '0000FF'),
(43, '0000CD'),
(44, '00008B'),
(45, '000080'),
(46, '191970'),
(47, '4169E1'),
(51, '1E90FF'),
(52, '4682B4'),
(53, '00BFFF'),
(54, '5F9EA0'),
(55, '00CED1'),
(56, '008B8B'),
(57, '008080'),
(58, '2F4F4F'),
(59, '48D1CC'),
(60, '20B2AA'),
(61, '66CDAA'),
(62, '3CB371'),
(63, '2E8B57'),
(64, '8FBC8F'),
(65, '32CD32'),
(67, '228B22'),
(68, '008000'),
(69, '006400'),
(70, '556B2F'),
(72, '6B8E23'),
(73, '808000'),
(74, 'DAA520'),
(75, 'B8860B'),
(78, 'FF8C00'),
(79, 'CD853F'),
(80, 'F4A460'),
(81, 'D2691E'),
(82, '8B4513'),
(83, 'A0522D'),
(84, 'E9967A'),
(85, 'FF6347'),
(86, 'FA8072'),
(87, 'F08080'),
(88, 'BC8F8F'),
(89, 'CD5C5C'),
(90, 'FF0000'),
(91, 'A52A2A'),
(92, 'B22222'),
(93, '8B0000'),
(94, '800000');

-- --------------------------------------------------------

--
-- Table structure for table `decrease`
--

CREATE TABLE `decrease` (
  `id` int(11) NOT NULL,
  `quote` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `decrease`
--

INSERT INTO `decrease` (`id`, `quote`) VALUES
(3, 'Shut up, you\'ll never be the man your mother is.'),
(4, 'You\'re a failed abortion, whose birth certificate is an apology from the condom factory.'),
(5, 'You must have been born on a highway, because that\'s where most accidents happen.'),
(6, 'Your family tree is a cactus, because everybody on it is a prick.'),
(7, 'You\'re so ugly, Hello Kitty said goodbye to you.'),
(8, 'It looks like your face caught on fire, and someone tried to put it out with a fork.'),
(9, 'You are so ugly, that when your mama dropped you off at school, she got a fine for littering.'),
(10, 'If you were twice as smart, you\'d still be stupid.'),
(11, 'Do you have to leave so soon? I was just about to poison the tea.'),
(12, 'You\'re so ugly, that when you popped out, the doctor said, \'Aww what a treasure\', and your mother said, \'Yeah, let\'s bury it\'.'),
(13, 'I like the sound you make when you shut up.'),
(14, 'Dumbass.'),
(15, 'We all sprang from apes, but you didn\'t spring far enough.'),
(16, 'I hear when you were a child, your mother wanted to hire somebody to take care of you, but the mafia wanted too much.'),
(17, 'I would ask how old you are, but I know you can\'t count that high.'),
(18, 'Out of 100,000 sperm, you were the fastest?'),
(19, 'If you really want to know about mistakes, you should ask your parents.'),
(20, 'Hey, you have something on your chin... 3rd one down.');

-- --------------------------------------------------------

--
-- Table structure for table `improve`
--

CREATE TABLE `improve` (
  `id` int(11) NOT NULL,
  `quote` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `improve`
--

INSERT INTO `improve` (`id`, `quote`) VALUES
(16, 'Your smile is contagious.'),
(17, 'You look great today.'),
(18, 'You\'re a smart cookie.'),
(19, 'I bet you make babies smile.'),
(20, 'You have impeccable manners.'),
(21, 'I like your style.'),
(22, 'You have the best laugh.'),
(23, 'I appreciate you.'),
(24, 'You are the most perfect you there is.'),
(25, 'You light up the room.'),
(26, 'You should be proud of yourself.'),
(27, 'You have a great sense of humor.'),
(29, 'Is that your picture next to \'charming\' in the dictionary?'),
(30, 'On a scale from 1 to 10, you\'re an 11.'),
(31, 'You are brave.'),
(32, 'You\'re even more beautiful on the inside than you are on the outside.'),
(33, 'If cartoon bluebirds were real, a bunch of them would be sitting on your shoulders singing right now.'),
(34, 'You are making a difference.'),
(35, 'You\'re like sunshine on a rainy day.'),
(36, 'You bring out the best in other people.'),
(37, 'You\'re a great listener.'),
(38, 'Everything would be better if more people were like you!'),
(39, 'Hanging out with you is always a blast.'),
(40, 'Being around you makes everything better!'),
(41, 'When you say, \'I meant to do that,\' I totally believe you.'),
(42, 'Colours seem brighter when you\'re around.'),
(43, 'You\'re wonderful.'),
(44, 'Jokes are funnier when you tell them.'),
(45, 'You\'re one of a kind!'),
(46, 'You\'re inspiring.'),
(47, 'You should be thanked more often. So thank you!!'),
(48, 'Our community is better because you\'re in it.'),
(49, 'You have the best ideas.'),
(50, 'You always know how to find that silver lining.'),
(51, 'Everyone gets knocked down sometimes, but you always get back up and keep going.'),
(52, 'You\'re a candle in the darkness.'),
(53, 'You\'re a great example to others.'),
(54, 'Being around you is like being on a happy little vacation.'),
(55, 'You always know just what to say.'),
(56, 'If someone based an Internet meme on you, it would have impeccable grammar.'),
(57, 'The people you love are lucky to have you in their lives.'),
(58, 'You\'re like a breath of fresh air.'),
(59, 'You\'re so thoughtful.'),
(60, 'Your creative potential seems limitless.'),
(61, 'Actions speak louder than words, and yours tell an incredible story.'),
(62, 'You\'re someone\'s reason to smile.'),
(63, 'You\'re even better than a unicorn, because you\'re real.'),
(64, 'You\'re really something special.'),
(65, 'You\'re a gift to those around you.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `colours`
--
ALTER TABLE `colours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `decrease`
--
ALTER TABLE `decrease`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `improve`
--
ALTER TABLE `improve`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `colours`
--
ALTER TABLE `colours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;
--
-- AUTO_INCREMENT for table `decrease`
--
ALTER TABLE `decrease`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `improve`
--
ALTER TABLE `improve`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
