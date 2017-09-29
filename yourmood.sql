-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 29, 2017 at 12:44 AM
-- Server version: 5.7.19-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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
  `active` tinyint(1) NOT NULL,
  `colour` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `colours`
--

INSERT INTO `colours` (`id`, `active`, `colour`) VALUES
(23, 1, 'DC143C'),
(24, 1, 'DB7093'),
(25, 1, 'FF69B4'),
(26, 1, 'FF1493'),
(27, 1, 'C71585'),
(28, 1, 'DA70D6'),
(31, 1, '8B008B'),
(33, 1, 'BA55D3'),
(34, 1, '9400D3'),
(36, 1, '4B0082'),
(37, 1, '8A2BE2'),
(38, 1, '9370DB'),
(39, 1, '7B68EE'),
(40, 1, '6A5ACD'),
(41, 1, '483D8B'),
(42, 1, '0000FF'),
(44, 1, '00008B'),
(47, 1, '4169E1'),
(51, 1, '1E90FF'),
(52, 1, '4682B4'),
(53, 1, '00BFFF'),
(54, 1, '5F9EA0'),
(55, 1, '00CED1'),
(56, 1, '008B8B'),
(57, 1, '008080'),
(58, 1, '2F4F4F'),
(59, 1, '48D1CC'),
(60, 1, '20B2AA'),
(61, 1, '66CDAA'),
(62, 1, '3CB371'),
(63, 1, '2E8B57'),
(65, 1, '32CD32'),
(67, 1, '228B22'),
(69, 1, '006400'),
(70, 1, '556B2F'),
(72, 1, '6B8E23'),
(73, 1, '808000'),
(74, 1, 'DAA520'),
(75, 1, 'B8860B'),
(78, 1, 'FF8C00'),
(80, 1, 'F4A460'),
(81, 1, 'D2691E'),
(82, 1, '8B4513'),
(84, 1, 'E9967A'),
(85, 1, 'FF6347'),
(86, 1, 'FA8072'),
(87, 1, 'F08080'),
(88, 1, 'BC8F8F'),
(89, 1, 'CD5C5C'),
(90, 1, 'FF0000'),
(92, 1, 'B22222'),
(93, 1, '8B0000'),
(95, 1, '1D89CB');

-- --------------------------------------------------------

--
-- Table structure for table `decrease`
--

CREATE TABLE `decrease` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `quote` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `decrease`
--

INSERT INTO `decrease` (`id`, `active`, `quote`) VALUES
(3, 1, 'Shut up, you\'ll never be the man your mother is.'),
(4, 1, 'You\'re a failed abortion, whose birth certificate is an apology from the condom factory.'),
(5, 1, 'You must have been born on a highway, because that\'s where most accidents happen.'),
(6, 1, 'Your family tree is a cactus, because everybody on it is a prick.'),
(7, 1, 'You\'re so ugly, Hello Kitty said goodbye to you.'),
(8, 1, 'It looks like your face caught on fire, and someone tried to put it out with a fork.'),
(9, 1, 'You are so ugly, that when your mama dropped you off at school, she got a fine for littering.'),
(10, 1, 'If you were twice as smart, you\'d still be stupid.'),
(11, 1, 'Do you have to leave so soon? I was just about to poison the tea.'),
(12, 1, 'You\'re so ugly, that when you popped out, the doctor said, \'Aww what a treasure\', and your mother said, \'Yeah, let\'s bury it\'.'),
(13, 1, 'I like the sound you make when you shut up.'),
(14, 1, 'Dumbass.'),
(15, 1, 'We all sprang from apes, but you didn\'t spring far enough.'),
(16, 1, 'I hear when you were a child, your mother wanted to hire somebody to take care of you, but the mafia wanted too much.'),
(17, 1, 'I would ask how old you are, but I know you can\'t count that high.'),
(18, 1, 'Out of 100,000 sperm, you were the fastest?'),
(19, 1, 'If you really want to know about mistakes, you should ask your parents.'),
(20, 1, 'Hey, you have something on your chin... 3rd one down.');

-- --------------------------------------------------------

--
-- Table structure for table `improve`
--

CREATE TABLE `improve` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `quote` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `improve`
--

INSERT INTO `improve` (`id`, `active`, `quote`) VALUES
(16, 1, 'Your smile is contagious.'),
(17, 1, 'You look great today.'),
(18, 1, 'You\'re a smart cookie.'),
(19, 1, 'I bet you make babies smile.'),
(20, 1, 'You have impeccable manners.'),
(21, 1, 'I like your style.'),
(22, 1, 'You have the best laugh.'),
(23, 1, 'I appreciate you.'),
(24, 1, 'You are the most perfect you there is.'),
(25, 1, 'You light up the room.'),
(26, 1, 'You should be proud of yourself.'),
(27, 1, 'You have a great sense of humor.'),
(29, 1, 'Is that your picture next to \'charming\' in the dictionary?'),
(30, 1, 'On a scale from 1 to 10, you\'re an 11.'),
(31, 1, 'You are brave.'),
(32, 1, 'You\'re even more beautiful on the inside than you are on the outside.'),
(33, 1, 'If cartoon bluebirds were real, a bunch of them would be sitting on your shoulders singing right now.'),
(34, 1, 'You are making a difference.'),
(35, 1, 'You\'re like sunshine on a rainy day.'),
(36, 1, 'You bring out the best in other people.'),
(37, 1, 'You\'re a great listener.'),
(38, 1, 'Everything would be better if more people were like you!'),
(39, 1, 'Hanging out with you is always a blast.'),
(40, 1, 'Being around you makes everything better!'),
(41, 1, 'When you say, \'I meant to do that,\' I totally believe you.'),
(42, 1, 'Colours seem brighter when you\'re around.'),
(43, 1, 'You\'re wonderful.'),
(44, 1, 'Jokes are funnier when you tell them.'),
(45, 1, 'You\'re one of a kind!'),
(46, 1, 'You\'re inspiring.'),
(47, 1, 'You should be thanked more often. So thank you!!'),
(48, 1, 'Our community is better because you\'re in it.'),
(49, 1, 'You have the best ideas.'),
(50, 1, 'You always know how to find that silver lining.'),
(51, 1, 'Everyone gets knocked down sometimes, but you always get back up and keep going.'),
(52, 1, 'You\'re a candle in the darkness.'),
(53, 1, 'You\'re a great example to others.'),
(54, 1, 'Being around you is like being on a happy little vacation.'),
(55, 1, 'You always know just what to say.'),
(56, 1, 'If someone based an Internet meme on you, it would have impeccable grammar.'),
(57, 1, 'The people you love are lucky to have you in their lives.'),
(58, 1, 'You\'re like a breath of fresh air.'),
(59, 1, 'You\'re so thoughtful.'),
(60, 1, 'Your creative potential seems limitless.'),
(61, 1, 'Actions speak louder than words, and yours tell an incredible story.'),
(62, 1, 'You\'re someone\'s reason to smile.'),
(63, 1, 'You\'re even better than a unicorn, because you\'re real.'),
(64, 1, 'You\'re really something special.'),
(65, 1, 'You\'re a gift to those around you.');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `sent_at` varchar(30) NOT NULL,
  `ip_address` varchar(20) NOT NULL,
  `version` varchar(10) NOT NULL,
  `platform` varchar(10) NOT NULL,
  `log` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `setting` varchar(30) NOT NULL,
  `value` text NOT NULL,
  `user` tinyint(1) NOT NULL,
  `optional` tinyint(1) NOT NULL,
  `advanced` tinyint(1) NOT NULL,
  `mobile` tinyint(1) NOT NULL,
  `input` varchar(10) NOT NULL,
  `min` int(6) NOT NULL,
  `max` int(6) NOT NULL,
  `label` text NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `active`, `setting`, `value`, `user`, `optional`, `advanced`, `mobile`, `input`, `min`, `max`, `label`, `description`) VALUES
(1, 1, 'reload_interval', '3000', 1, 0, 0, 1, 'range', 0, 10000, 'Auto Reload Interval (ms)', 'How often the auto reload will function, in milliseconds'),
(4, 1, 'toast_interval', '2000', 0, 0, 0, 0, 'number', 0, 0, '', '***NOT USER CHANGEABLE***'),
(10, 1, 'reload_keys', '["space", "enter", "right", "d"]', 1, 1, 0, 0, 'chips', 0, 0, 'Reload Keyboard Shortcuts', 'Which keys will activate a reload, in a JavaScript KeyDown KeyCode array.<br>Go to a KeyCode testing site to find out what KeyDown value your desired keys have'),
(11, 1, 'no_repeats', 'true', 0, 0, 0, 0, '', 0, 0, '', '***NOT USER CHANGEABLE***'),
(15, 1, 'back_keys', '["backspace", "left", "a"]', 1, 1, 0, 0, 'chips', 0, 0, 'Rewind Keyboard Shortcuts', 'Which keys will go back to the previous quote/colour, in a JavaScript KeyDown KeyCode array.<br>Go to a KeyCode testing site to find out what KeyDown value your desired keys have'),
(17, 1, 'auto_reload_keys', '["r"]', 1, 1, 0, 0, 'chips', 0, 0, 'Auto Reload Keyboard Shortcuts', 'Which keys will toggle auto reloading, in a JavaScript KeyDown KeyCode array.<br>Go to a KeyCode testing site to find out what KeyDown value your desired keys have'),
(18, 1, 'settings_keys', '["s"]', 1, 1, 0, 0, 'chips', 0, 0, 'Toggle Settings Panel Keyboard Shortcuts', 'Which keys will toggle the settings panel, in a JavaScript KeyDown KeyCode array.<br>Go to a KeyCode testing site to find out what KeyDown value your desired keys have'),
(19, 1, 'save_settings_keys', '["enter"]', 0, 0, 0, 0, 'chips', 0, 0, '', '***NOT USER CHANGEABLE***'),
(20, 1, 'backend_address', 'improveyourmood.xyz', 1, 0, 1, 1, 'text', 0, 0, 'Custom Back-End Address', 'Define a custom back-end address, rather than using the live one. Used for development purposes'),
(22, 1, 'colour_reload_transitions', 'true', 1, 0, 0, 1, 'select', 0, 0, 'Colour Reload Transitions', 'Whether the background colour will have a fade transition when changing'),
(23, 1, 'extra_logging', '[]', 0, 0, 0, 0, '', 0, 0, '', '***NOT USER CHANGEABLE***'),
(24, 1, 'colour_reload_transition_time', '1200', 1, 0, 0, 1, 'range', 100, 5000, 'Colour Reload Transition Time (ms)', 'How long the colour reload transitions will take to complete, in milliseconds'),
(25, 1, 'text_reload_transitions', 'true', 1, 0, 0, 1, 'select', 0, 0, 'Text Reload Transitions', 'Whether the text will have a fade transition when changing'),
(26, 1, 'text_reload_transition_time', '400', 1, 0, 0, 1, 'range', 100, 5000, 'Text Reload Transition Time (ms)', 'How long the text reload transitions will take to complete, in milliseconds'),
(29, 1, 'app_version', '6.6.0', 0, 0, 0, 0, 'number', 0, 0, '', '***NOT USER CHANGEABLE***'),
(30, 1, 'app_update_reminder', 'true', 0, 0, 0, 0, '', 0, 0, '', 'Please update to the latest version of the app.'),
(33, 1, 'reverse_swipe_direction', 'false', 1, 0, 0, 1, 'select', 0, 0, 'Reverse Swipe Direction', 'Reverse the directions that you swipe to reload/rewind'),
(34, 1, 'button_icons', '{"menu":"menu", "autoreload":"autorenew", "settings":"settings", "rewind":"skip_previous"}', 0, 0, 0, 0, 'chips', 0, 0, '', ''),
(35, 1, 'require_settings_reload', 'false', 0, 0, 0, 0, 'select', 0, 0, '', ''),
(36, 1, 'menu_keys', '["m"]', 0, 0, 0, 0, 'text', 0, 0, 'Menu Keyboard Shortcuts', 'Which keys will toggle the menu, in a JavaScript KeyDown KeyCode array.<br>Go to a KeyCode testing site to find out what KeyDown value your desired keys have'),
(37, 1, 'scroll_settings', 'true', 0, 0, 0, 0, 'select', 0, 0, '', ''),
(38, 1, 'button_order', '["autoreload", "settings", "rewind"]', 1, 0, 1, 1, 'chips', 0, 0, 'Button Menu Order', 'The order of the buttons in the button menu. Alternatively, these can be reordered by clicking and dragging them around. Any values that aren\'t apart of the default 3 will be ignored.'),
(39, 1, 'theme_colour', 'white', 1, 0, 0, 1, 'text', 0, 0, 'Theme Colour', 'What colour the accents (text, icons) will appear. Needs to be a valid CSS colour (eg. white, black, red, orange, green, etc.)'),
(40, 1, 'full_rewind_keys', '["shift+backspace"]', 0, 0, 0, 0, 'text', 0, 0, '', ''),
(41, 1, 'optional_indicators', 'true', 0, 0, 0, 0, 'select', 0, 0, '', ''),
(44, 1, 'reset_input_buttons', 'false', 0, 0, 0, 0, '', 0, 0, '', ''),
(45, 1, 'keep_advanced_settings', 'false', 1, 0, 1, 1, 'checkbox', 0, 0, 'Keep Advanced Settings', 'If enabled, advanced settings will not be set to default when \'Set All to Default\' is clicked, unless the advanced settings section is open. This is useful when testing on a custom back-end address');

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
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `improve`
--
ALTER TABLE `improve`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;
--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=279;
--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
