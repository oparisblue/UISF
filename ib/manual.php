<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8">
		<title>Manual - Scaffold</title>
		<link href="https://cdn.materialdesignicons.com/4.7.95/css/materialdesignicons.min.css
" rel="stylesheet" type="text/css" media="none" onload="media='all'">
		<style>
			body {
				font-family:"Trebuchet MS";
				color:#fff;
				background-color:#212121;
				padding-left:10%;
				padding-right:10%;
			}
			a {
				color:#fff;
				cursor:pointer;
				text-decoration:none;
				transform:rotate(45deg);
				display:inline-block;
				width:20px;
			}
			a:hover {
				color:#f44336;
			}
		</style>
	</head>
	<body>
		<h1 id="ib">Scaffold <a href="#ib"><i class="mdi mdi-link"></i></a></h1>
		
		<h2 id="ideology">Basic Ideology <a href="#ideology"><i class="mdi mdi-link"></i></a></h2>
		<p>The idea behind Scaffold is to speed up the development of web applications. It takes many hints from software like XCode, but ultimately aims to be simpler, and more coherient.</p>
		<p>One key point is that Scaffold tries to allow for all tasks to be performed visually by wiring together components, rather than relying on code to perform anything other than basic actions. Note that this does not mean that Scaffold prevents or discourages writing custom code, simply that it tries to offer faster and easier alternatives.</p>
		<p>Realistically, Scaffold boils down to performing a few key tasks:</p>
		<ul>
			<li>Creating user interfaces where components are all positioned relative to each other, removing guessing and "magic numbers" from layout design. <em>See: Constraints</em>.</li>
			<li>Allowing for the radical change of layouts based off of screen size. <em>See: Responsive Constraints</em></li>
			<li>Creating dynamic interfaces where data can easily flow between elements. <em>See: Wiring</em></li>
			<li>Providing the means to create incredibly complex applications out of visual components, without constraint: <em>See: Scripting Components</em></li>
			<li>Making systems which effortlessly intergrate and respond to other concepts, like servers and rights management: <em>See: Contexts</em></li>
		</ul>
		
		<h2 id="gettingStarted">Getting Started <a href="#gettingStarted"><i class="mdi mdi-link"></i></a></h2>
		<p>By pressing the "New Component" button or using the keyboard shortcut ⌘ + D, you open the object library, where you can search for a component which you can then drag and drop into the scene.</p>
		<p>The first component you will want to add is a "Page". Each page contains groups of components, and for most other components, you will want to add them to a page.</p>
		<p>On the left-hand side of the screen, you should see a pane with three tabs. The first tab shows properties for the given element, and should be selected by default. This is where you would change the name of a button, set whether a checkbox starts out checked, etc. The second tab shows layout constraints for the selected element, which will be covered in the next section. Finally, the third tab shows the outline for the whole project, specifically which elements are nested inside of others. Clicking on an element in the outline will select it, double clicking on an element will center it in the main view pane.</p>
		<p>With an element selected you can press the backspace key to delete it.</p>
		<p>You can pan and zoom around the main view using trackpad gestures, or if you prefer, there are three tool buttons on the bottom bar: <i class="mdi mdi-cursor-default"></i> allows you to select elements, <i class="mdi mdi-hand-right"></i> allows you to click-and-drag to pan around, and <i class="mdi mdi-magnify"></i> allows you to click-and-drag to zoom in and out. Additionally, if you hold down the alt key while in select mode, you will also be able to pan until you release alt.</p>
		<p>When releasing an element you are dragging above multiple other elements, the default behaviour is to parent it to the bottom-most element of the set you are hovering over which accepts children. You can drag it out of that element using the outline view. The outline view also allows for you to adjust the z-index of elements - elements towards the bottom appear above elements towards the top.</p>
		
		<h2 id="constraints">Constraints <a href="#constraints"><i class="mdi mdi-link"></i></a></h2>
		<p>Constraints allow you to position elements. To begin, click the constraints tab in the inspector (<i class="mdi mdi-ruler-square"></i>). You will see an empty list of constraints. Click the add button at the bottom of the list to add new constraint(s). There are 9 possible constraints which can be added:</p>
		<ul>
			<li>Width: how wide the element is</li>
			<li>Height: how high the element is</li>
			<li>Center X: if ticked, the element will be centered on the X axis</li>
			<li>Center Y: if ticked, the element will be centered on the Y axis</li>
			<li>Hidden: if ticked, the element will be made invisible</li>
			<li>Top / Bottom / Left / Right: each of these constraints is made up of 3 parts: first, click the line linking that input box to the center to toggle the constraint on and off. Then, use the select button to choose a component which will form the basis of this component's position on that axis. Finally, use the input box to enter a constant value which will be added to the selected component's position value.
			<p>For example: if I select a button element (button 1), enable the left constraint, and select a different button (button 2) as the component for that constraint, then enter 20 as the constant, then button 1's left position will be set to button 2's right position + 20. This will always be the case - even if button 2 moves.</p>
			<p>Note: if you select both a left and a right constraint (or top and bottom), then the width (or height) of the element will be set as the space between those two values.</p>
			</li>
		</ul>
		The list will then display the constraints that you have added. Errors will be shown in the dev console when building the site if:
		<ul>
			<li>An element does not have at least one constraint on both the X and Y axis;</li>
			<li>An element cannot figure out its width or height (not explicitly set, and only 0-1 values on corrisponding X/Y axis);</li>
			<li>There are two (or more) of the same type of constraint on the same element (e.g. two width constraints on the same element).</li>
			<li>There are unresolvable / circular constraints (e.g. button 1 specifies its right constraint to be button 2, but button 2 specifies its left constraint to be button 1).</li>
		</ul>
		The behaviour if any of these errors are tripped is undefined. It is recommended to fix the errors.
		
		<h2 id="responsiveConstraints">Responsive Constraints <a href="#responsiveConstraints"><i class="mdi mdi-link"></i></a></h2>
		<p>If the "Responsive Mode" button on the toolbar is clicked, you can choose a size of device screen to emulate, and then flip a checkbox on to toggle the emulation. This button will remain lit up green until the emulation is disabled.</p>
		<p>While responsive mode is on, adding constraints normally adds constraints which will only apply when <= the emulated screen width. Do not worry about conflicting constraints in this case - the one for the appropriate screen size will be chosen. You can add constraints for as many different screen size breakpoints as you want.</p>
		
		<h2 id="wiring">Wiring <a href="#wiring"><i class="mdi mdi-link"></i></a></h2>
		<p>Right-click an element to open up its outlets menu. An outlet is where you can run a wire from. An element can have two types of outlet:</p>
		<ul>
			<li>Properties: one of the element's properties - e.g. "disabled" on a button, etc.</li>
			<li>Events: these represent things which happen to the element - e.g. "clicked" on a button, etc.</li>
		</ul>
		<p>Properties are dynamically updated each tick. Events pulse their wire only when the event fires (e.g. when a user clicks the button).</p>
		<p>From it's outlet, you can click and drag on the circle to run a wire from it. Release the wire over an input in the properties inspector to bind the two together, or over another element to open its inlets menu for the given type of wire.</p>
		<p>For example, if you wanted to make a button be disabled / enabled based on whether or not a checkbox is checked, you could wire the "checked" outlet on the checkbox to the "disabled" inlet on the button. Then, if the checkbox is checked, the button is disabled. Note that arrows have a direction! If you had wired from the "disabled" outlet on the button to the "checked" inlet on the checkbox, then the checkbox would have been checked only when the button was disabled - checking the checkbox would do nothing, and in fact you would not be able to check the checkbox, as its state would be constantly overriden by the value of whether the button was disabled.</p>
		
		<h2 id="scriptingComponents">Scripting Components <a href="#scriptingComponents"><i class="mdi mdi-link"></i></a></h2>
		<p>If you want to perform more complex tasks, you will need to use Scripting Components. These are components which can be dragged onto the scene, which provide inlets and outlets for wiring, but which are not visible to the user. They are designed to provide more complex wiring functionality which would not otherwise be possible. For example, say you wanted to make it so that the button was only enabled when the checkbox is enabled - the opposite of what we had previously. You could drag in a "Truth Table" component, set it to negate input, and then drag the checkbox's checked wire to its input, and its output wire to the button.</p>
		<p>Another useful scripting component is the Applicator. It allows you to select an element and one of its properties, and then perform an action on it, but only when the Applicator receives an event. It is useful for performing an action when a button is clicked, etc.</p>
		<p>Many other scripting components are avaliable, such as variables, loops, if statements, etc.</p>
		<p>To interact with the server, you can use three special scripting components: the database component, which runs a query on the database, the file system component, which reads and writes files to the server, and the socket component, which allows you to send and receive messages from an external socket server. Each of these components is highly configurable, and designed to plug in to the rights management system to ensure that users can only perform tasks that they are authorised for. SQL queries are stored in a text file along with permissions for them - not in JavaScript / on the client.</p>
		
		<h2 id="contexts">Contexts <a href="#contexts"><i class="mdi mdi-link"></i></a></h2>
		<p>Contexts are wrappers which you can put other components in. They affect the behaviour of these components in some way.</p>
		<p>The key concept is that their children are only applied the context they represent. They are not visible to the client (but their children can be), however in design mode they have a coloured background so that they can easily be told apart from other areas, and to provide a drop target to add elements into them without having to use the outline. This area can be resized.</p>
		<h3 id="rights">Rights Context <a href="#rights"><i class="mdi mdi-link"></i></a></h3>
		<p>Often, you only want actions to visible or performable if the user has a certain set of rights. For example, maybe a delete button only appears if the user is an administrator. This is incredibly easy to do with Scaffold. Simply add in the rights context, and in the properties inspector, you can configure whether what rights it requires. Now, any elements which are added as children of this context will only be added to the page if the user has the given set of rights. Note that any client or server components should also be within the rights context to prevent hackers from still being able to perform those actions even without the UI control being visible.</p>
	</body>
</html>