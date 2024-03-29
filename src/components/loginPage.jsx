/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState}from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUsers, usersSelector, setUserInData} from '../store/reducer/usersControlSlice';
import {setViews} from '../store/reducer/viewsControlSlice';

const Login = () => {

    const [inputUserName, setInputUserName] = useState('');
    const [userName, setUserName] = useState([]);
    const [userStatus, setUserStatus] = useState('');

    const dispatch = useDispatch();

    const allUsers = useSelector(usersSelector);

    const api_url = `http://18.218.0.232:8110/uaa/users`;

    useEffect(() => {
        async function fetchPostList(){
            try {
                const requestUrl = api_url;
                const response = await fetch(requestUrl);
                //console.log(response);
            
                const responseJSON = await response.json();
                
                console.log(responseJSON);
                
                dispatch(setUsers(responseJSON));                
                //Clear data to get Username Only
                let newUsersName = [];
                for(let i = 0; i < responseJSON.length; i++){
                    newUsersName.push(responseJSON[i].username)
                 }
                 setUserName([...userName, newUsersName]);

                 //console.log(newUsersName);
            } catch (error) {
                console.log('Failed to Fetch', error);
            } 
        }
        fetchPostList();
    
    }, []);

    const getInputUserName = (event) => {
        setInputUserName(event.target.value);
    } 

    const checkUserName = (event) => {
        //debugger;
        event.preventDefault();
        //console.log(userName);
        let statusCheckPoint = ''; // if we match user name don't run Status

                for(let x = 0; x < allUsers.length; x++){
                    if(allUsers[x].username === inputUserName ){
                        //console.log(allUsers[i]);
                        dispatch(setUserInData(allUsers[x]));
                        dispatch(setViews('welcome')); 
                        setUserStatus(''); //remove status after fail login
                        statusCheckPoint = 'welcome';
                        //break the loop so you don't need to loop through the rest when you get it
                        break; 
                    }
                }
        if(statusCheckPoint === '') {
            setUserStatus("Username is not available");
        }  
    }
    
    //set state to direct to Create Acc page
    const setCreateAcc = (event) => {
        event.preventDefault();
        dispatch(setViews('createAcc'));
    }

    return(
        <div className="login-form w-25 mx-auto">
            <form onSubmit={checkUserName}>
                <h2 className="text-center">Log in</h2>       
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Username" required="required"
                    value={inputUserName}
                    onChange={getInputUserName}
                    />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password" />
                </div>
                <p style={{color:'red'}}>{userStatus}</p>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">Log in</button>
                </div>       
            </form>
            <p className="text-center" onClick={setCreateAcc}><a href="createAcc">Create an Account</a></p>
        </div>
    )
}

export default Login;
