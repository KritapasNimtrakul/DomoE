const handleDomo = (e) => {
    e.preventDefault();
    
    $('#domoMessage').animate({width:'hide'},350);
    
    if($('#domoName').val() == '' || $('#domoAge').val() == '') {
        handleError('RAWR! All fields are required');
        return false;
    }
    
    sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function(){
        loadDomosFromServer($('#domoForm')[0][3].value);
    });
    return false;
};

const DomoForm = (props) => {
    return (
    <form id='domoForm' onSubmit={handleDomo} name='domoForm' action='/maker' method='POST' className='domoForm' >
        
        <label htmlFor='name'>Name: </label>
        <input id='domoName' type='text' name='name' placeholder='Domo Name'/>
        <label htmlFor='age'>Age: </label>
        <input id='domoAge' type='text' name='age' placeholder='Domo Age' />
        <label htmlFor='height'>Height: </label>
        <input id='domoHeight' type='text' name='height' placeholder='Domo height' />
        <input type='hidden' name='_csrf' value={props.csrf} />
        <input className='makeDomoSubmit' type='submit' value='Make Domo' />
        
        </form>
        
    );
};

const deleteDomo = (e) => {
    console.log($('#deleteForm')[0][1].value);
    e.preventDefault();
    sendAjax('POST', $('#deleteForm').attr('action'), $('#deleteForm').serialize() , function(){
        console.log('hello');
        loadDomosFromServer($('#deleteForm')[0][1].value);
    });
    
    return false;
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
        <div className='domoList'>
            <h3 className='emptyDomo'>No Domos yet</h3>
            </div>)
    };



const domoNodes = props.domos.map(function(domo) {
    return (
    <div key={domo._id} className='domo'>
            <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
            <h3 classNAme='domoName'>Name: {domo.name}</h3>
            <h3 className='domoHeight'>Height: {domo.height}</h3>
            <h3 className='domoAge'>Age: {domo.age}</h3>
            
            <form id='deleteForm' onSubmit={deleteDomo} name='deleteForm' action='/deleteDomo' method='POST' className='deleteForm' >
            <input type='hidden' name='id' value={domo._id} />
                
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='deleteFormSubmit' type='submit' value='Delete' />
            
            </form>
        </div>
        
    );
});

return (
<div className='domoList'>{domoNodes}</div>
);
};

const loadDomosFromServer = (csrf) => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
        <DomoList csrf={csrf} domos={data.domos} />, document.querySelector('#domos')
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector('#makeDomo')
    );
    ReactDOM.render(
    <DomoList csrf={csrf} domos={[]} />, document.querySelector('#domos')
    );
    
    loadDomosFromServer(csrf);
};


const getToken = () => {
    sendAjax('GET','/getToken',null, (result) => {
        setup(result.csrfToken);
        console.log('setup'+result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});