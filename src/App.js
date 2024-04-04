import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

//learning key prop deffing rules

export default function App() {
  const [friends, setfriends] = useState(initialFriends);
  const [show, showaddfriend] = useState(false);
  const [selectedfriend, setselected] = useState(null);

  // this will toggle the form by setting up show value
  function handleshowaddfriend() {
    showaddfriend((show) => !show);
  }

  // this will add friend to the friends list and toggle the form to the false
  function handleAddFriend(friend) {
    setfriends((friends) => [...friends, friend]);
    // then make the form hide again as friend got added
    showaddfriend(false);
  }

  function handleselected(friend) {
    setselected((cur) => (cur?.id === friend.id ? null : friend));
    showaddfriend(false);
  }

  // as per payment mad by user or friend will gets friends balance updated
  function handlesplitbill(value) {
    setfriends((friends) =>
      friends.map((f) =>
        f.id === selectedfriend.id ? { ...f, balance: f.balance + value } : f
      )
    );

    // once operation is done we remove the highlighter as well selected to default
    setselected(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        {/* //this will display the friends list */}
        <FriendsList
          friends={friends}
          onselection={handleselected}
          currentlyselected={selectedfriend}
        />
        {/* as per show value is toggles the form */}
        {show && <FormAddFriend onaddfriend={handleAddFriend} />}

        {/* this will add selected friend to list on false we get add friend option  */}
        <Button onClick={handleshowaddfriend}>
          {show ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedfriend && (
        <FormSplitBill
          selectedfriend={selectedfriend}
          onsplit={handlesplitbill}
          key={selectedfriend.id}
        />
      )}
    </div>
  );
}

// handle the add friend onclick
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onselection, currentlyselected }) {
  return (
    <ul>
      {/* this will render list of friends though map function and friends component */}
      {friends.map((item) => (
        <Friend
          item={item}
          key={item.key}
          onselection={onselection}
          currentlyselected={currentlyselected}
        />
      ))}
    </ul>
  );
}

// this will display the list of friends
function Friend({ item, onselection, currentlyselected }) {
  const isselected = currentlyselected?.id === item.id;
  return (
    <div>
      {/* if selected then higlight the same */}
      <li className={isselected ? "selected" : ""}>
        {/* below is the name image and according to the balance display message as well sets the color  */}
        <img src={item.image} alt={item.name}></img>
        <h3>{item.name}</h3>
        {item.balance < 0 && (
          <p className="red">
            You owe {item.name} ${Math.abs(item.balance)}
          </p>
        )}
        {item.balance > 0 && (
          <p className="green">
            {item.name} owes you ${Math.abs(item.balance)}
          </p>
        )}
        {item.balance === 0 && (
          <p>
            You and {item.name} are even ${Math.abs(item.balance)}
          </p>
        )}
        {/* button display close or selected */}
        {/* this will pass the selected item  */}
        <Button onClick={() => onselection(item)}>
          {isselected ? "close" : "Selected"}
        </Button>
      </li>
    </div>
  );
}

function FormAddFriend({ onaddfriend }) {
  // this will take the name
  const [name, setname] = useState("");
  // sets the random avatar for friend
  const [image, setimage] = useState("https://i.pravatar.cc/48");

  function handlesubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    // create random id
    const id = crypto.randomUUID();

    // create new object
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    // provide same to add friend function
    onaddfriend(newFriend);

    // set to default once got added
    setname("");

    setimage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      {/* take name as input */}
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      ></input>

      {/* set the image */}
      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      ></input>

      <Button>Add</Button>
    </form>
  );
}

//provided selected friend to split as well as handlesplit
function FormSplitBill({ selectedfriend, onsplit }) {
  //total bill value
  const [bill, setbill] = useState("");
  // this will set paid amount from user
  const [paidbyuser, setpaidbyuser] = useState("");
  // this will set how much selected friend will pay
  const [whoispaying, setwhoispaying] = useState("user");
  const paidbyfriend = bill ? bill - paidbyuser : "";

  function handlesubmit(e) {
    e.preventDefault();
    // if no bill and paid values of user not get submitted
    if (!bill || !paidbyuser) return;

    // if we are paying then sent friendspaying amount if not sent our
    onsplit(whoispaying === "user" ? paidbyfriend : -paidbyuser);
  }

  return (
    <form className="form-split-bill" onSubmit={handlesubmit}>
      {/* display friend which selected */}
      <h2>Split a Bill with {selectedfriend.name} </h2>
      <label>💵Bill Value</label>
      {/* set bill value using setbill state function */}
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      ></input>

      <label>🧑‍🦰Your expense</label>
      {/* enter the amount which we will  pay will not be allowed to enter greater than bill */}
      <input
        type="text"
        value={paidbyuser}
        onChange={(e) =>
          setpaidbyuser(
            Number(e.target.value) > bill ? paidbyuser : Number(e.target.value)
          )
        }
      ></input>

      <label>🧑‍🤝‍🧑{selectedfriend.name} expense</label>

      {/* disabled the same will get calculated according to user pay  */}
      <input type="text" disabled value={paidbyfriend}></input>

      <label>✅Who is paying the Bill</label>
      {/* we will select who is paying according to options provided in the select as user or friend */}
      <select
        value={whoispaying}
        onChange={(e) => setwhoispaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="x">{selectedfriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
