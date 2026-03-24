# Feature : Game modes
- To add different game modes that allows for users to play the game with different end and win conditions.
## Landing page:
- Bring all the visible elements within a single container that is in the middle of the page. 
- Maintain the glass morphism inside the container as well.
- Reduce the font and padding size accordingly. Maintain the responsiveness and limit the size of the container in mobile devices.
- When the `Play` button is clicked, a popup should appear which asks for the mode of the game. Possible game modes are:
    - Classic - 5 points
    - Classic - 10 points
    - Classic - 20 points
    - Sudden Death - 2 minutes
    - Sudden Death - 5 minutes
- On clicking any of the option, it should redirect to the game page. Now, the game page has a URL of `/game`. It should be navigated with a state `mode` where options are 
    - `classic_5`
    - `classic_10`, 
    - `classic_25`, 
    - `sd_120`, 
    - `sd_300` 
so that the mode is not exposed in the URL.

## Game page : 
- Make changes the game end logic according to the mode of game.
### Classic - 10 points
- State is `classic_10`. This mode is currently available, the game ends when the points of human or computer reaches 10 points.
### Classic - 20 points
- State is `classic_20`. In this mode, the game must end when either of the player or computer reaches 20 points.
- The final score to end the game must be dynamically stored to ensure both `classic_10` and `classic_20` works fine. Do similar work for `classic_5` as well.
### Sudden Death - 2 minutes
- State is `sd_120`. Game is played for 2 minutes and whoever has highest point by the end of 2 minutes should be declared as winners.
### Sudden Death - 5 minutes
- Similar to `sd_120` with 5 minutes as end time.
- Make the Rock, Paper, Scissor buttons look good with proper padding changes. And change their size accordingly so that they dont overflow in mobile devices. 

## Login page:
- Convert the entire page into glass morphism with dark theme.
- Add `Back` button to navigate to the home page with proper warning popup as of the game page.

## Signup page:
- Make the same changes you did in the login page. And ensure custom validation errors are being displayed properly. Keep the login and signup logic non-functional for now till I verify the mongodb running status.

- Rewamp the structure of the page without losing the responsiveness. 
- The page should not trigger overflow in any devices and the size of the page should be exactly screen size. Remove the `rgb(141,255,179)` colored text which tells the final points to win. Instead of that, display the mode of game somewhere in apt place in the game page, maybe below the game name.
- The golden colored text corresponds to instruction and it is dynamic. Whenever the instruction is about waiting for something, add the loading animation. 
- Change the font colors everywhere to match the app theme context and glass morphism principle. Keep the font size responsive and apt to the page. 
- Change the game over and Exit popup to glass morphism and blur the background whenver possible. Maintain the ratio of the popup accordingly. 