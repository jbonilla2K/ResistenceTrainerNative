# ResistenceTrainerNative

Option Selected: Option 2

Screen Components Implemented -

1. Login Screen
   -users can access existing account if exists within loginData
2. Registration Screen
   -new users can push new login information to loginData
3. Selection (Main Menue) Screen
4. Regiment Editing Screen
   -users swipe to determine the order of their weekly exercise routine
5. Goals Viewing/Editing Screen
   -view their maximum lifts and goal weights by group (via curGroup/setCurGroup)
   +sorted to each respective exercise via dispExercises/setDispExercises
   -update their goals by group (via setGoal(1-3))
6. Workout Screen
   -accesses a different list of exercises depending on the user's regiment and day of the week (via RegIndex & get.Day)
   -progresses through a different list for each workout routine (setCur[exercise group]&RegIndex switch)
   -automatically updates a user's maximum lifts if an attempted value is higher than the listed maximum (setCurWeight(1-3))
