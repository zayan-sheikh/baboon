import json

class LangException(Exception):
    """Exception for user issues, should be caught and reported to user"""
    pass


ds       = []  # The data stack
cStack   = []  # The control structure stack
pcode    = []  # Saved code to execute or use in fn def
plist    = []  # List of poses that defines the program
stateStack = []  # Stack of saved program states


# Runtime action functions
def rZero(): 
    ds.append(0)

def rOne():
    ds.append(1)

def rAdd():
    if len(ds) < 2:
        raise LangException("plus requires two elements on stack")
    a = ds.pop()
    b = ds.pop()
    ds.append(a + b)

def rDup2():
    if len(ds) < 2:
        raise LangException("dup2 requires two elements on stack")
    ds.append(ds[-1])
    ds.append(ds[-3])
    
def rVoid():
    pass


# Control flow functions
def cStartFunc():
    if cStack: 
        raise LangException("Function started inside control sequence")
    cStack.append("FUNCTION")


def cEndFunc():
    global pcode
    if not cStack or cStack[-1] != "FUNCTION":
        raise LangException("Function ended without start")
    cStack.pop()
    rDict['runFunc'] = pcode[:]  # save custom function in rDict
    pcode = []


# Dictionary of poses mapping to runtime actions.
rDict = {
    'zero': rZero, 'one': rOne,
    'plus': rAdd, 'dup2': rDup2,
    'runFunc': rVoid  # can be overwritten by custom functions
}


# Dictionary of poses mapping to control flow.
cDict = {
    'startFunc': cStartFunc, 'endFunc': cEndFunc
}


def undo():
    # restore prev state of the program
    global ds, cStack, pcode, plist
    if len(stateStack) == 1:
        clear()
    elif len(stateStack) == 0:
        raise LangException("Too early to undo")
    else:
        stateStack.pop()
        prevState = stateStack[-1]
        ds = prevState['ds']
        cStack = prevState['cStack']
        pcode = prevState['pcode']
        plist = prevState['plist']


def clear():
    global ds, cStack, pcode, plist
    ds = []
    cStack = []
    pcode = []
    plist = []
    rDict['runFunc'] = rVoid
    

def doPose(poseName: str):
    """
    Execute a pose in the program.
    Pose string must be in rDict or cDict.
    """
    global pcode
    
    # handle undo
    if poseName == 'undo':
        undo()
        return
    
    # fetch
    rPose = rDict.get(poseName)  # is there a runtime action?
    cPose = cDict.get(poseName)  # is there a control flow action?
    
    # compile
    if cPose:
        # run control flow actions immediately
        cPose()
    elif rPose:
        if isinstance(rPose, list):
            # custom defined function
            pcode += rPose
        else:
            pcode.append(rPose)
    else:
        # pose not in dictionaries
        raise KeyError(f'Invalid pose: {poseName}')
    
    # execute
    if not cStack:
        for f in pcode:
            try:
                f()
            except LangException as err:
                pcode = []
                raise err
        pcode = []
    
    # add to program file and save state (if no errors)
    plist.append(poseName)
    saveState()
    

def saveState():
    stateStack.append({
        'ds': ds[:],
        'cStack': cStack[:],
        'pcode': pcode[:],
        'plist': plist[:]
    })

    
# Program words to emojis (as list of Unicode codepoints)
emojiDict = {
    'zero': '0️⃣', 'one': '1️⃣',
    'plus': '➕', 'dup2': '📝📝',
    'runFunc': '🏃', 'startFunc': '🎬', 'endFunc': '🏁'
}


def getState():
    """Get the state of the program, including code and stack, as a JSON object."""
    return json.dumps({
        'program_text': plist,
        'program_emojis': [emojiDict[p] for p in plist],
        'stack': ds
    })


def main():
    """For testing only"""
    while True:
        doPose(input('> '))
        print(getState())
        

def prompt():
    """For testing only"""
    doPose(input('> '))

    
if __name__ == '__main__':
    main()