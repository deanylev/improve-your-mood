-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 22, 2020 at 07:24 PM
-- Server version: 5.7.29-0ubuntu0.16.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.12

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
  `created_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `colour` varchar(6) DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `colours`
--

INSERT INTO `colours` (`id`, `created_at`, `created_by`, `active`, `colour`, `notes`) VALUES
(23, '0000-00-00 00:00:00', 0, 1, 'DC143C', ''),
(24, '0000-00-00 00:00:00', 0, 1, 'DB7093', ''),
(25, '0000-00-00 00:00:00', 0, 1, 'FF69B4', ''),
(26, '0000-00-00 00:00:00', 0, 1, 'FF1493', ''),
(27, '0000-00-00 00:00:00', 0, 1, 'C71585', ''),
(28, '0000-00-00 00:00:00', 0, 1, 'DA70D6', ''),
(31, '0000-00-00 00:00:00', 0, 1, '8B008B', ''),
(33, '0000-00-00 00:00:00', 0, 1, 'BA55D3', ''),
(34, '0000-00-00 00:00:00', 0, 1, '9400D3', ''),
(36, '0000-00-00 00:00:00', 0, 1, '4B0082', ''),
(37, '0000-00-00 00:00:00', 0, 1, '8A2BE2', ''),
(38, '0000-00-00 00:00:00', 0, 1, '9370DB', ''),
(39, '0000-00-00 00:00:00', 0, 1, '7B68EE', ''),
(40, '0000-00-00 00:00:00', 0, 1, '6A5ACD', ''),
(41, '0000-00-00 00:00:00', 0, 1, '483D8B', ''),
(42, '0000-00-00 00:00:00', 0, 1, '0000FF', ''),
(44, '0000-00-00 00:00:00', 0, 1, '00008B', ''),
(47, '0000-00-00 00:00:00', 0, 1, '4169E1', ''),
(51, '0000-00-00 00:00:00', 0, 1, '1E90FF', ''),
(52, '0000-00-00 00:00:00', 0, 1, '4682B4', ''),
(53, '0000-00-00 00:00:00', 0, 1, '00BFFF', ''),
(54, '0000-00-00 00:00:00', 0, 1, '5F9EA0', ''),
(55, '0000-00-00 00:00:00', 0, 1, '00CED1', ''),
(56, '0000-00-00 00:00:00', 0, 1, '008B8B', ''),
(57, '0000-00-00 00:00:00', 0, 1, '008080', ''),
(58, '0000-00-00 00:00:00', 0, 1, '2F4F4F', ''),
(59, '0000-00-00 00:00:00', 0, 1, '48D1CC', ''),
(60, '0000-00-00 00:00:00', 0, 1, '20B2AA', ''),
(61, '0000-00-00 00:00:00', 0, 1, '66CDAA', ''),
(62, '0000-00-00 00:00:00', 0, 1, '3CB371', ''),
(63, '0000-00-00 00:00:00', 0, 1, '2E8B57', ''),
(65, '0000-00-00 00:00:00', 0, 1, '32CD32', ''),
(67, '0000-00-00 00:00:00', 0, 1, '228B22', ''),
(69, '0000-00-00 00:00:00', 0, 1, '006400', ''),
(70, '0000-00-00 00:00:00', 0, 1, '556B2F', ''),
(72, '0000-00-00 00:00:00', 0, 1, '6B8E23', ''),
(73, '0000-00-00 00:00:00', 0, 1, '808000', ''),
(74, '0000-00-00 00:00:00', 0, 1, 'DAA520', ''),
(75, '0000-00-00 00:00:00', 0, 1, 'B8860B', ''),
(78, '0000-00-00 00:00:00', 0, 1, 'FF8C00', ''),
(80, '0000-00-00 00:00:00', 0, 1, 'F4A460', ''),
(81, '0000-00-00 00:00:00', 0, 1, 'D2691E', ''),
(82, '0000-00-00 00:00:00', 0, 1, '8B4513', ''),
(84, '0000-00-00 00:00:00', 0, 1, 'E9967A', ''),
(85, '0000-00-00 00:00:00', 0, 1, 'FF6347', ''),
(86, '0000-00-00 00:00:00', 0, 1, 'FA8072', ''),
(87, '0000-00-00 00:00:00', 0, 1, 'F08080', ''),
(88, '0000-00-00 00:00:00', 0, 1, 'BC8F8F', ''),
(89, '0000-00-00 00:00:00', 0, 1, 'CD5C5C', ''),
(90, '0000-00-00 00:00:00', 0, 1, 'FF0000', ''),
(92, '0000-00-00 00:00:00', 0, 1, 'B22222', ''),
(93, '0000-00-00 00:00:00', 0, 1, '8B0000', ''),
(95, '0000-00-00 00:00:00', 0, 1, '1D89CB', '');

-- --------------------------------------------------------

--
-- Table structure for table `decrease`
--

CREATE TABLE `decrease` (
  `id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `quote` text,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `decrease`
--

INSERT INTO `decrease` (`id`, `created_at`, `created_by`, `active`, `quote`, `notes`) VALUES
(3, '0000-00-00 00:00:00', 0, 1, 'Shut up, you\'ll never be the man your mother is.', ''),
(4, '0000-00-00 00:00:00', 0, 1, 'You\'re a failed abortion, whose birth certificate is an apology from the condom factory.', ''),
(5, '0000-00-00 00:00:00', 0, 1, 'You must have been born on a highway, because that\'s where most accidents happen.', ''),
(6, '0000-00-00 00:00:00', 0, 1, 'Your family tree is a cactus, because everybody on it is a prick.', ''),
(7, '0000-00-00 00:00:00', 0, 1, 'You\'re so ugly, Hello Kitty said goodbye to you.', ''),
(8, '0000-00-00 00:00:00', 0, 1, 'It looks like your face caught on fire, and someone tried to put it out with a fork.', ''),
(9, '0000-00-00 00:00:00', 0, 1, 'You are so ugly, that when your mama dropped you off at school, she got a fine for littering.', ''),
(10, '0000-00-00 00:00:00', 0, 1, 'If you were twice as smart, you\'d still be stupid.', ''),
(11, '0000-00-00 00:00:00', 0, 1, 'Do you have to leave so soon? I was just about to poison the tea.', ''),
(12, '0000-00-00 00:00:00', 0, 1, 'You\'re so ugly, that when you popped out, the doctor said, \'Aww what a treasure\', and your mother said, \'Yeah, let\'s bury it\'.', ''),
(13, '0000-00-00 00:00:00', 0, 1, 'I like the sound you make when you shut up.', ''),
(14, '0000-00-00 00:00:00', 0, 1, 'Dumbass.', ''),
(15, '0000-00-00 00:00:00', 0, 1, 'We all sprang from apes, but you didn\'t spring far enough.', ''),
(16, '0000-00-00 00:00:00', 0, 1, 'I hear when you were a child, your mother wanted to hire somebody to take care of you, but the mafia wanted too much.', ''),
(17, '0000-00-00 00:00:00', 0, 1, 'I would ask how old you are, but I know you can\'t count that high.', ''),
(18, '0000-00-00 00:00:00', 0, 1, 'Out of 100,000 sperm, you were the fastest?', ''),
(19, '0000-00-00 00:00:00', 0, 1, 'If you really want to know about mistakes, you should ask your parents.', ''),
(20, '0000-00-00 00:00:00', 0, 1, 'Hey, you have something on your chin... 3rd one down.', '');

-- --------------------------------------------------------

--
-- Table structure for table `improve`
--

CREATE TABLE `improve` (
  `id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `quote` text,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `improve`
--

INSERT INTO `improve` (`id`, `created_at`, `created_by`, `active`, `quote`, `notes`) VALUES
(16, '0000-00-00 00:00:00', 0, 1, 'Your smile is contagious.', ''),
(17, '0000-00-00 00:00:00', 0, 1, 'You look great today.', ''),
(18, '0000-00-00 00:00:00', 0, 1, 'You\'re a smart cookie.', ''),
(19, '0000-00-00 00:00:00', 0, 1, 'I bet you make babies smile.', ''),
(20, '0000-00-00 00:00:00', 0, 1, 'You have impeccable manners.', ''),
(21, '0000-00-00 00:00:00', 0, 1, 'I like your style.', ''),
(22, '0000-00-00 00:00:00', 0, 1, 'You have the best laugh.', ''),
(23, '0000-00-00 00:00:00', 0, 1, 'I appreciate you.', ''),
(24, '0000-00-00 00:00:00', 0, 1, 'You are the most perfect you there is.', ''),
(25, '0000-00-00 00:00:00', 0, 1, 'You light up the room.', ''),
(26, '0000-00-00 00:00:00', 0, 1, 'You should be proud of yourself.', ''),
(27, '0000-00-00 00:00:00', 0, 1, 'You have a great sense of humor.', ''),
(29, '0000-00-00 00:00:00', 0, 1, 'Is that your picture next to \'charming\' in the dictionary?', ''),
(30, '0000-00-00 00:00:00', 0, 1, 'On a scale from 1 to 10, you\'re an 11.', ''),
(31, '0000-00-00 00:00:00', 0, 1, 'You are brave.', ''),
(32, '0000-00-00 00:00:00', 0, 1, 'You\'re even more beautiful on the inside than you are on the outside.', ''),
(33, '0000-00-00 00:00:00', 0, 1, 'If cartoon bluebirds were real, a bunch of them would be sitting on your shoulders singing right now.', ''),
(34, '0000-00-00 00:00:00', 0, 1, 'You are making a difference.', ''),
(35, '0000-00-00 00:00:00', 0, 1, 'You\'re like sunshine on a rainy day.', ''),
(36, '0000-00-00 00:00:00', 0, 1, 'You bring out the best in other people.', ''),
(37, '0000-00-00 00:00:00', 0, 1, 'You\'re a great listener.', ''),
(38, '0000-00-00 00:00:00', 0, 1, 'Everything would be better if more people were like you!', ''),
(39, '0000-00-00 00:00:00', 0, 1, 'Hanging out with you is always a blast.', ''),
(40, '0000-00-00 00:00:00', 0, 1, 'Being around you makes everything better!', ''),
(41, '0000-00-00 00:00:00', 0, 1, 'When you say, \'I meant to do that,\' I totally believe you.', ''),
(42, '0000-00-00 00:00:00', 0, 1, 'Colours seem brighter when you\'re around.', ''),
(43, '0000-00-00 00:00:00', 0, 1, 'You\'re wonderful.', ''),
(44, '0000-00-00 00:00:00', 0, 1, 'Jokes are funnier when you tell them.', ''),
(45, '0000-00-00 00:00:00', 0, 1, 'You\'re one of a kind!', ''),
(46, '0000-00-00 00:00:00', 0, 1, 'You\'re inspiring.', ''),
(47, '0000-00-00 00:00:00', 0, 1, 'You should be thanked more often. So thank you!!', ''),
(48, '0000-00-00 00:00:00', 0, 1, 'Our community is better because you\'re in it.', ''),
(49, '0000-00-00 00:00:00', 0, 1, 'You have the best ideas.', ''),
(50, '0000-00-00 00:00:00', 0, 1, 'You always know how to find that silver lining.', ''),
(51, '0000-00-00 00:00:00', 0, 1, 'Everyone gets knocked down sometimes, but you always get back up and keep going.', ''),
(52, '0000-00-00 00:00:00', 0, 1, 'You\'re a candle in the darkness.', ''),
(53, '0000-00-00 00:00:00', 0, 1, 'You\'re a great example to others.', ''),
(54, '0000-00-00 00:00:00', 0, 1, 'Being around you is like being on a happy little vacation.', ''),
(55, '0000-00-00 00:00:00', 0, 1, 'You always know just what to say.', ''),
(56, '0000-00-00 00:00:00', 0, 1, 'If someone based an Internet meme on you, it would have impeccable grammar.', ''),
(57, '0000-00-00 00:00:00', 0, 1, 'The people you love are lucky to have you in their lives.', ''),
(58, '0000-00-00 00:00:00', 0, 1, 'You\'re like a breath of fresh air.', ''),
(59, '0000-00-00 00:00:00', 0, 1, 'You\'re so thoughtful.', ''),
(60, '0000-00-00 00:00:00', 0, 1, 'Your creative potential seems limitless.', ''),
(61, '0000-00-00 00:00:00', 0, 1, 'Actions speak louder than words, and yours tell an incredible story.', ''),
(62, '0000-00-00 00:00:00', 0, 1, 'You\'re someone\'s reason to smile.', ''),
(63, '0000-00-00 00:00:00', 0, 1, 'You\'re even better than a unicorn, because you\'re real.', ''),
(64, '0000-00-00 00:00:00', 0, 1, 'You\'re really something special.', ''),
(65, '0000-00-00 00:00:00', 0, 1, 'You\'re a gift to those around you.', '');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `ip_address` varchar(20) DEFAULT NULL,
  `version` varchar(10) DEFAULT NULL,
  `useragent` text,
  `localstorage` text,
  `log` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `setting` varchar(30) DEFAULT NULL,
  `value` text,
  `user` tinyint(1) DEFAULT NULL,
  `advanced` tinyint(1) DEFAULT NULL,
  `mobile` tinyint(1) DEFAULT NULL,
  `input` varchar(10) DEFAULT NULL,
  `options` text,
  `tab` varchar(15) DEFAULT NULL,
  `min` decimal(6,1) DEFAULT NULL,
  `max` decimal(6,1) DEFAULT NULL,
  `step` decimal(6,1) DEFAULT '1.0',
  `label` text,
  `description` text,
  `custom_html` text,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `created_at`, `created_by`, `active`, `position`, `setting`, `value`, `user`, `advanced`, `mobile`, `input`, `options`, `tab`, `min`, `max`, `step`, `label`, `description`, `custom_html`, `notes`) VALUES
(1, '0000-00-00 00:00:00', 0, 1, 20, 'reload_interval', '3000', 1, 0, 1, 'range', '', 'behaviour', '0.0', '10000.0', '0.0', 'Auto Reload Interval (ms)', 'How often the auto reload will function, in milliseconds.', '', ''),
(4, '0000-00-00 00:00:00', 0, 1, 1, 'toast_interval', '1500', 0, 0, 0, 'number', '', ' ', '0.0', '0.0', '0.0', '', '', '', ''),
(10, '0000-00-00 00:00:00', 0, 1, 27, 'reload_keys', '["space", "enter", "right", "d"]', 1, 0, 0, 'chips', '', 'keyboard', '0.0', '0.0', '0.0', 'Reload Keyboard Shortcuts', 'Which keys will activate a reload.', '', ''),
(15, '0000-00-00 00:00:00', 0, 1, 28, 'back_keys', '["backspace", "left", "a"]', 1, 0, 0, 'chips', '', 'keyboard', '0.0', '0.0', '0.0', 'Rewind Keyboard Shortcuts', 'Which keys will go back to the previous quote/colour.', '', ''),
(17, '0000-00-00 00:00:00', 0, 1, 29, 'auto_reload_keys', '["r"]', 1, 0, 0, 'chips', '', 'keyboard', '0.0', '0.0', '0.0', 'Auto Reload Keyboard Shortcuts', 'Which keys will toggle auto reloading.', '', ''),
(18, '0000-00-00 00:00:00', 0, 1, 30, 'settings_keys', '[&quot;s&quot;, &quot;up&quot;, &quot;down&quot;]', 1, 0, 0, 'chips', '', 'keyboard', '0.0', '0.0', '0.0', 'Toggle Settings Panel Keyboard Shortcuts', 'Which keys will toggle the settings panel.', '', ''),
(20, '0000-00-00 00:00:00', 0, 1, 7, 'backend_address', 'https://improveyourmood.xyz', 1, 1, 1, 'text', '', 'advanced', '0.0', '0.0', '0.0', 'Custom Back-End Address', 'Define a custom back-end address, rather than using the live one. Used for development purposes.', '&lt;br&gt;&lt;a id=&quot;set-backend-local&quot; class=&quot;black-text settings-link&quot;&gt;&lt;b&gt;Set to Local&lt;/b&gt;&lt;/a&gt;', ''),
(24, '0000-00-00 00:00:00', 0, 1, 13, 'colour_reload_transition_time', '1200', 1, 0, 1, 'range', '', 'appearance', '0.0', '5000.0', '0.0', 'Colour Reload Transition Time (ms)', 'How long the colour reload transitions will take to complete, in milliseconds.', '', ''),
(26, '0000-00-00 00:00:00', 0, 1, 14, 'text_reload_transition_time', '400', 1, 0, 1, 'range', '', 'appearance', '0.0', '5000.0', '0.0', 'Text Reload Transition Time (ms)', 'How long the text reload transitions will take to complete, in milliseconds.', '', ''),
(33, '0000-00-00 00:00:00', 0, 1, 21, 'reverse_swipe_direction', 'false', 1, 0, 1, 'checkbox', '', 'behaviour', '0.0', '0.0', '0.0', 'Reverse Swipe Direction', 'Reverse the directions that you swipe to reload/rewind.', '', ''),
(34, '0000-00-00 00:00:00', 0, 1, 0, 'button_icons', '{&quot;menu&quot;:&quot;menu&quot;, &quot;autoreload&quot;:&quot;autorenew&quot;, &quot;settings&quot;:&quot;settings&quot;, &quot;rewind&quot;:&quot;skip_previous&quot;, &quot;switchversion&quot;:&quot;swap_calls&quot;, &quot;setalldefault&quot;:&quot;clear_all&quot;, &quot;fullrewind&quot;:&quot;first_page&quot;, &quot;speak&quot;:&quot;volume_up&quot;, &quot;profile&quot;:&quot;person&quot;, &quot;logout&quot;:&quot;exit_to_app&quot;, &quot;stopspeak&quot;:&quot;stop&quot;, &quot;profilesavesettings&quot;:&quot;cloud_upload&quot;, &quot;profiledownloadsettings&quot;:&quot;cloud_download&quot;, &quot;profileclearsettings&quot;:&quot;clear&quot;}', 0, 0, 0, '', '', '', '0.0', '0.0', '0.0', '', '', '', ''),
(36, '0000-00-00 00:00:00', 0, 1, 31, 'menu_keys', '["m"]', 1, 0, 0, 'chips', '', 'keyboard', '0.0', '0.0', '0.0', 'Menu Keyboard Shortcuts', 'Which keys will toggle the menu.', '', ''),
(38, '0000-00-00 00:00:00', 0, 1, 15, 'button_order', '[&quot;autoreload&quot;, &quot;settings&quot;, &quot;profile&quot;, &quot;speak&quot;, &quot;rewind&quot;]', 1, 0, 1, 'chips', '', 'appearance', '0.0', '0.0', '0.0', 'Button Menu Order', 'The order of the buttons in the button menu. Alternatively, these can be reordered by clicking and dragging them around. Any values that aren\'t apart of the default 5 will be ignored.', '', ''),
(39, '0000-00-00 00:00:00', 0, 1, 17, 'theme_colour', 'white', 1, 0, 1, 'select', '["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"]', 'appearance', '0.0', '0.0', '0.0', 'Theme Colour', 'What colour the accents (text, icons) will appear. Needs to be a valid CSS colour (eg. white, black, red, orange, green, etc.).', '', ''),
(44, '0000-00-00 00:00:00', 0, 1, 2, 'reset_input_buttons', 'true', 0, 0, 0, '', '', '', '0.0', '0.0', '0.0', '', '', '', ''),
(45, '0000-00-00 00:00:00', 0, 1, 8, 'keep_advanced_settings', 'false', 1, 1, 1, 'checkbox', '', 'advanced', '0.0', '0.0', '0.0', 'Keep Advanced Settings', 'If enabled, advanced settings will not be set to default when \'Set All to Default\' is clicked. This is useful when testing on a custom back-end address.', '', ''),
(48, '0000-00-00 00:00:00', 0, 1, 3, 'tabs', '["appearance", "behaviour", "keyboard", "advanced"]', 0, 0, 0, '', '', '', '0.0', '0.0', '0.0', '', '', '', ''),
(50, '0000-00-00 00:00:00', 0, 1, 4, 'keep_tab', 'true', 0, 0, 0, '', '', '', '0.0', '0.0', '0.0', '', '', '', ''),
(51, '0000-00-00 00:00:00', 0, 1, 9, 'disable_caching', 'false', 1, 1, 1, 'checkbox', '', 'advanced', '0.0', '0.0', '0.0', 'Disable Caching', 'If enabled, quotes and colours will not be cached, and fresh copies will be pulled every time the page loads. Settings will not be cached either (though cached settings are only used if pulling from the API fails).', '&lt;br&gt;&lt;a id=&quot;clear-cache&quot; class=&quot;black-text settings-link&quot;&gt;&lt;b&gt;Clear Cache&lt;/b&gt;&lt;/a&gt;', ''),
(53, '0000-00-00 00:00:00', 0, 1, 22, 'speak_voice_accent', 'UK English Female', 1, 0, 1, 'radio', '[&quot;UK English Female&quot;, &quot;UK English Male&quot;, &quot;US English Female&quot;, &quot;Australian Female&quot;, &quot;Russian Female&quot;, &quot;Spanish Female&quot;, &quot;Afrikaans Male&quot;, &quot;Korean Female&quot;, &quot;Japanese Female&quot;]', 'behaviour', '0.0', '0.0', '0.0', 'Speaking Voice Accent', 'What accent the text to speech engine will use when speaking the current quote.', '', ''),
(57, '0000-00-00 00:00:00', 0, 1, 5, 'view_logs_keys', '["l"]', 0, 0, 0, '', '', '', '0.0', '0.0', '0.0', '', '', '', ''),
(58, '0000-00-00 00:00:00', 0, 1, 32, 'profile_keys', '["u"]', 1, 0, 0, 'chips', '', 'keyboard', '0.0', '0.0', '0.0', 'Toggle Profile Panel Keyboard Shortcuts', 'Which keys will toggle the user profile panel.', '', ''),
(59, '0000-00-00 00:00:00', 0, 1, 10, 'user_sync_interval', '0', 1, 1, 1, 'range', '', 'advanced', '0.0', '60000.0', '0.0', 'User Sync Interval (ms)', 'If set to 0, your login status will only be synced with the admin panel after a page refresh.&lt;br&gt;Otherwise, your login status will automatically be synced on the defined interval.', '', ''),
(62, '2017-12-11 10:18:17', 10, 1, 33, 'speak_quote_keys', '[&quot;t&quot;]', 1, 0, 0, 'chips', '', 'keyboard', '0.0', '0.0', '0.0', 'Speak Quote Keyboard Shortcuts', 'Which keys will speak the current quote.', '', ''),
(63, '2017-12-17 20:18:25', 10, 1, 18, 'hide_sync_button', 'false', 1, 0, 1, 'checkbox', '', 'appearance', '0.0', '0.0', '0.0', 'Hide User Sync Button', 'If enabled, the manual sync / sync status button in the user profile modal will be hidden.', '', ''),
(64, '2017-12-23 17:36:05', 10, 0, 11, 'ignore_profile_settings', 'false', 0, 1, 1, 'checkbox', '', 'advanced', '0.0', '0.0', '0.0', 'Ignore Profile Settings', 'If enabled, settings saved to the logged in user profile will not take any effect and only local/back-end settings will be utilised.', '', ''),
(65, '2017-12-26 14:27:18', 10, 1, 19, 'night_mode', 'false', 1, 0, 1, 'checkbox', '', 'appearance', '0.0', '0.0', '0.0', 'Night Mode', 'If enabled, white menus will be displayed in black, with white text.', '', ''),
(66, '2017-12-26 17:38:56', 10, 1, 12, 'settings_sync_interval', '0', 1, 1, 1, 'range', '', 'advanced', '0.0', '60000.0', '0.0', 'Settings Sync Interval (ms)', 'If set to 0, your backend settings will only be synced with the admin panel after a page refresh.&lt;br&gt;Otherwise, your backend settings will automatically be synced on the defined interval.&lt;br&gt;Please note that only setting values will be synced, other attributes will still only come into effect after a refresh (eg. input type).&lt;br&gt;Some settings (such as tabs) will still not come into effect until after a page refresh.', '&lt;br&gt;&lt;a id=&quot;sync-settings&quot; class=&quot;ladda-button black-text settings-link settings-sync-button&quot; data-style=&quot;zoom-in&quot; data-spinner-color=&quot;black&quot;&gt;&lt;span class=&quot;ladda-label&quot;&gt;&lt;b&gt;Sync Now&lt;/b&gt;&lt;/span&gt;&lt;/a&gt;', ''),
(67, '2017-12-26 19:27:07', 10, 1, 34, 'night_mode_keys', '[&quot;n&quot;]', 1, 0, 0, 'chips', '', 'keyboard', '0.0', '0.0', '0.0', 'Night Mode Keyboard Shortcuts', 'Which keys will toggle night mode.', '', ''),
(68, '2018-01-01 15:49:02', 10, 1, 6, 'translation_languages', '[&quot;ru&quot;, &quot;es&quot;, &quot;af&quot;, &quot;ko&quot;, &quot;ja&quot;]', 0, 0, 0, '', '', '', '0.0', '0.0', '0.0', '', '', '', ''),
(69, '2018-01-01 15:49:21', 10, 1, 25, 'quote_language', 'en', 1, 0, 1, 'radio', '{&quot;English&quot;: &quot;en&quot;, &quot;Russian&quot;: &quot;ru&quot;, &quot;Spanish&quot;: &quot;es&quot;, &quot;Afrikaans&quot;: &quot;af&quot;, &quot;Korean&quot;: &quot;ko&quot;, &quot;Japanese&quot;:&quot;ja&quot;}', 'behaviour', '0.0', '0.0', '0.0', 'Quote Language', 'What language the quotes will be displayed in.', '', ''),
(71, '2018-01-01 23:26:30', 10, 1, 26, 'decrease_default', 'false', 1, 0, 1, 'checkbox', '', 'behaviour', '1.0', '0.0', '0.0', 'Decrease Default', 'If enabled, Decrease Your Mood will load as the default, rather than Improve Your Mood.', '', ''),
(74, '2018-01-06 23:53:52', 10, 1, 23, 'speak_voice_pitch', '1', 1, 0, 1, 'range', '', 'behaviour', '1.0', '2.0', '0.0', 'Speaking Voice Pitch', 'What pitch the text to speech engine will use when speaking the current quote.', '', ''),
(76, '2018-01-07 00:08:19', 10, 1, 24, 'speak_voice_rate', '1', 1, 0, 1, 'range', '', 'behaviour', '0.0', '1.5', '0.5', 'Speaking Voice Rate', 'How fast the text to speech engine will speak when speaking the current quote.', '', ''),
(77, '2018-01-13 20:26:03', 10, 1, 16, 'quote_font', 'Oxygen', 1, 0, 1, 'select', '[&quot;Oxygen&quot;, &quot;Helvetica&quot;, &quot;Arial&quot;, &quot;Raleway&quot;, &quot;Montserrat&quot;]', 'appearance', '0.0', '0.0', '1.0', 'Quote Font', 'What font the quote will be displayed in.', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `is_owner` tinyint(1) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  `read_only` tinyint(1) DEFAULT NULL,
  `items_per_page` int(11) DEFAULT '100',
  `user` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `app_settings` text,
  `image` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `is_admin`, `read_only`, `items_per_page`, `user`, `password`, `app_settings`) VALUES
(1, 1, 0, 100, 'admin', '5f4dcc3b5aa765d61d8327deb882cf99', '{}');

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `is_owner` (`is_owner`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;
--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3667;
--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
