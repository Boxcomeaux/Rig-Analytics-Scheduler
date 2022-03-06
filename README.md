# Rig Analytics Team Code Challenges (Trayvon Como)

* Instructions to run the code and install any necessary dependencies.
  > To run this program you will need to unzip the files in this folder and start a local hosting environment (localhost) that can open the index.html in a browser. Opening the index.html alone without a hosting environment will cause the application to fail. Many IDEs have their own hosting environment to run this application such as, Intellij IDEA, Visual Studio and VS Code.


* Description of the problem and solution.
  > The problem is that there is a list of customers and a list of tellers, and each teller needs an appointment time with each customer they are assigned. The solution was to create a loop that looped through the list of customers and assigned each customer the next available teller. When the application reaches the end of the teller loop, the teller loop will reset to 0 and start anew along with a new base start time for all tellers. More detail is explained within comments in the code.


* Assumptions you made.
  > The implementation of the multiplier was a bit confusing to me, so I created two applications. One application has the multiplier for customers and tellers who have the same specialty type and the other application does not have appointments with the same specialty types. The statement "in fact, a customer's service type may not match any teller's specialty type" made me think that the application required that no teller or customer should have the same specialty type, but that would essentially make the multiplier irrelevant so that's why I made the alternate application.


* If there are features you didn't have time to implement or would improve or do differently next time, describe the intended behavior.
  > There is always room for improvement with any application, but I think given the purpose and the time for this application my solution should suffice.


