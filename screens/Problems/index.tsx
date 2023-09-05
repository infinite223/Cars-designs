import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { selectTheme } from '../../slices/themeSlice'
import _Icon_Entypo from 'react-native-vector-icons/Entypo'
import { style } from './style'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import useAuth, { db } from '../../hooks/useAuth'
import { collection, collectionGroup, limit, onSnapshot, query, where } from 'firebase/firestore'
import { ProblemItem } from './ProblemItem'
import { SpecyficProblemType } from '../../utils/types'
export const ProblemsScreen = () => {
    const theme = useSelector(selectTheme)
    const navigation:any = useNavigation()
    const { user }:any = useAuth()
    const dispatch = useDispatch()
    const [problemsState, setProblemsState] = useState<SpecyficProblemType[]>([])
    // const orderByType = useSelector(selectOrderBy)
    const problemRef = collection(db, 'problems')
  
    const selectedCategory = {name: 'kategoria', type: ''}
    const errorText:any = []
    // const inputChange = useSelector(selectInputChange)

    useLayoutEffect(() => {
        navigation.setOptions({
           headerBackVisible:false,
           headerTitle: () => <Text style={{ fontSize:20, letterSpacing:1, fontWeight:'500', color:theme.fontColor}}>
              Problemy 
           </Text>,
          headerRight: () => 
          <TouchableOpacity style={{paddingHorizontal:15, paddingVertical:5}} onPress={() => navigation.navigate('CreateProblem')}>
            <_Icon_Entypo name={'plus'} size={26} color={theme.fontColor} style={{ marginRight: 0 }}/>
          </TouchableOpacity>
        })  
      }, [theme])

      useEffect(() => {
        if(user){
          const problemssQuery = selectedCategory.name==='kategoria'?
          query(problemRef, where('type', '==', 'General'), errorText.length>0?where("errorCodes", "array-contains", errorText):limit(50)):
          query(problemRef, where('type', '==', 'General'), where('category', '==', selectedCategory.type), errorText.length>0?where("errorCodes", "array-contains", errorText):limit(50))
      
            const unsubscribe = onSnapshot( query(problemRef, where('type', '==', 'General')), async (snapchot) => { 
            
              const allProblems:any = snapchot.docs.map((doc, i)=> {
                return doc.data()
              })
              console.log('getProblems')
              setProblemsState(allProblems)

            return () => {
              if(user) unsubscribe();
            };
          })
        }
      }, [
        // selectType, selectedCategory, inputChange, user
      ])

      
  return (
    <View style={[style.container, {backgroundColor: theme.background}]}>
        <ScrollView>
          {problemsState.map((data) => 
            <ProblemItem data={data}/>
          )}
        </ScrollView>
    </View>
  )
}
